<script lang="ts" module>
	import type { Position } from '../game/types';

	export type EmitterEventBellyMeter =
		| { type: 'bellyMeterShow' }
		| { type: 'bellyMeterHide' }
		| { type: 'bellyMeterSet'; mugs: number; level: number }
		| {
				type: 'bellyMeterDrink';
				positions: Position[];
				mugs: number;
				level: number;
				levelUp: boolean;
		  };
</script>

<script lang="ts">
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut, cubicIn, cubicOut } from 'svelte/easing';

	import { Circle, Container, Rectangle, Sprite, Text } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { stateBetDerived } from 'state-shared';
	import { waitForTimeout } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import GoldGlow from './GoldGlow.svelte';
	import TitleText from './TitleText.svelte';
	import { getContext } from '../game/context';
	import { i18nDerived } from '../i18n/i18nDerived';
	import {
		BOARD_SIZES,
		FREE_SPIN_PANEL,
		FREE_SPIN_PANEL_STYLE,
		SYMBOL_SIZE,
		TITLE_CREAM,
		titleTextStyle,
	} from '../game/constants';
	import { getSymbolX, getSymbolY } from '../game/utils';

	// Rumbelly's Belly: 4 groups of 4 mugs, each group unlocks the next multiplier.
	const MUGS_PER_LEVEL = 4;
	const MULTIPLIERS = [2, 3, 5, 10];
	const SLOT_COUNT = MULTIPLIERS.length * MUGS_PER_LEVEL;
	const EMPTY_ALPHA = 0.3;
	const FLY_DURATION = 450;
	const SPINS_PER_LEVEL = 2; // math: every new multiplier adds 2 free spins

	// New multiplier: the "x3" badge flies out of its meter row to the board centre, stays with
	// "+2 FREE SPINS", a foam burst and the gold glow, then flies back into the row. Drawn in code.
	// x10 (the last level) is bigger and stays longer. Game time: faster in turbo.
	const LEVEL_IN = 250; // ms, fly to the centre
	const LEVEL_HOLD = 700;
	const LEVEL_HOLD_MAX = 1000; // x10
	const LEVEL_OUT = 350; // ms, fly back to the row
	const BURST_TIME = 800;
	const BURST_COUNT = 24;
	const BURST_COUNT_MAX = 40;
	const FOAM_COLOR = 0xfff1d6;
	const BADGE_FONT = SYMBOL_SIZE * 1.1;
	const BOARD_CENTRE = { x: BOARD_SIZES.width / 2, y: BOARD_SIZES.height / 2 };

	const burst = _.times(BURST_COUNT_MAX, () => {
		const angle = _.random(0, Math.PI * 2, true);
		const distance = _.random(SYMBOL_SIZE * 0.8, SYMBOL_SIZE * 1.9, true);
		return {
			dx: Math.cos(angle) * distance,
			dy: Math.sin(angle) * distance * 0.75,
			diameter: _.random(SYMBOL_SIZE * 0.07, SYMBOL_SIZE * 0.2, true),
			delay: _.random(0, 150, true),
		};
	});

	type Point = { x: number; y: number };
	type Rect = { x: number; y: number; width: number; height: number };
	type Geometry = { mugSize: number; slots: Point[]; labels: Point[]; backing: Rect };

	// desktop / landscape: left of the reels, under the free spin counter (FREE_SPIN_PANEL);
	// groups fill from the bottom up
	const sideGeometry = (): Geometry => {
		const panel = FREE_SPIN_PANEL;
		const mugSize = SYMBOL_SIZE * 0.33;
		const gap = mugSize * 1.08;
		const rowHeight = mugSize * 1.2;
		const meterX = panel.x + panel.padding;
		const meterY = panel.y + panel.counterHeight;
		const rowY = (group: number) =>
			meterY + (MULTIPLIERS.length - 1 - group) * rowHeight + mugSize / 2;
		return {
			mugSize,
			// one backing for the counter and the meter
			backing: {
				x: panel.x,
				y: panel.y,
				width: panel.width,
				height: panel.counterHeight + MULTIPLIERS.length * rowHeight + panel.padding,
			},
			slots: _.range(SLOT_COUNT).map((index) => ({
				x: meterX + (index % MUGS_PER_LEVEL) * gap + mugSize / 2,
				y: rowY(Math.floor(index / MUGS_PER_LEVEL)),
			})),
			labels: MULTIPLIERS.map((_multiplier, group) => ({
				x: meterX + gap * MUGS_PER_LEVEL + mugSize * 0.2,
				y: rowY(group),
			})),
		};
	};

	// portrait: one strip under the reels, groups fill from left to right
	const stripGeometry = (): Geometry => {
		const groupWidth = BOARD_SIZES.width / MULTIPLIERS.length;
		const mugSize = groupWidth * 0.17;
		const gap = mugSize * 1.04;
		const y = BOARD_SIZES.height + SYMBOL_SIZE * 0.55;
		const groupX = (group: number) => group * groupWidth + mugSize * 0.3;
		const backingHeight = mugSize * 1.7;
		return {
			mugSize,
			backing: { x: 0, y: y - backingHeight / 2, width: BOARD_SIZES.width, height: backingHeight },
			slots: _.range(SLOT_COUNT).map((index) => ({
				x:
					groupX(Math.floor(index / MUGS_PER_LEVEL)) + (index % MUGS_PER_LEVEL) * gap + mugSize / 2,
				y,
			})),
			labels: MULTIPLIERS.map((_multiplier, group) => ({
				x: groupX(group) + gap * MUGS_PER_LEVEL + mugSize * 0.2,
				y,
			})),
		};
	};

	const SIDE = sideGeometry();
	const STRIP = stripGeometry();

	const context = getContext();
	const geometry = $derived(context.stateLayoutDerived.layoutType() === 'portrait' ? STRIP : SIDE);

	let show = $state(false);
	let filled = $state(0);
	let level = $state(0);
	let flashIndex = $state(-1);
	let flying = $state<{ id: number; x: Tween<number>; y: Tween<number> }[]>([]);

	const timed = (ms: number) => ms / stateBetDerived.timeScale();

	const drinkOne = async (position: Position, id: number, slotIndex: number) => {
		const target = geometry.slots[Math.min(slotIndex, SLOT_COUNT - 1)];
		// book positions include the top padding row
		const mug = {
			id,
			x: new Tween(getSymbolX(position.reel), { duration: timed(FLY_DURATION), easing: cubicIn }),
			y: new Tween(getSymbolY(position.row - 1), {
				duration: timed(FLY_DURATION),
				easing: cubicIn,
			}),
		};
		flying.push(mug);
		await Promise.all([mug.x.set(target.x), mug.y.set(target.y)]);
		flying = flying.filter((m) => m.id !== id);

		flashIndex = slotIndex;
		filled = Math.min(Math.max(filled, slotIndex + 1), SLOT_COUNT);
		await waitForTimeout(timed(180));
		if (flashIndex === slotIndex) flashIndex = -1;
	};

	// --- new multiplier celebration ---
	type LevelUp = { group: number; time: number; max: boolean };
	let levelUp = $state<LevelUp | null>(null);
	let levelFrame = 0;
	let levelDone: (() => void) | null = null;
	// the row label bumps when the badge lands back in it
	const labelPunch = new Tween(1, { duration: 250, easing: cubicOut });

	const holdOf = (up: LevelUp) => (up.max ? LEVEL_HOLD_MAX : LEVEL_HOLD);
	const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

	const endLevelUp = () => {
		cancelAnimationFrame(levelFrame);
		levelUp = null;
		levelDone?.();
		levelDone = null;
	};

	const celebrate = (group: number) =>
		new Promise<void>((resolve) => {
			endLevelUp();
			const up: LevelUp = { group, time: 0, max: group === MULTIPLIERS.length - 1 };
			const total = LEVEL_IN + holdOf(up) + LEVEL_OUT;
			levelUp = up;
			levelDone = resolve;
			let last = 0;
			const tick = (now: number) => {
				if (last && levelUp) levelUp.time += (now - last) * stateBetDerived.timeScale();
				last = now;
				if (!levelUp || levelUp.time >= total) {
					endLevelUp();
					labelPunch.set(1.5, { duration: 0 }).then(() => labelPunch.set(1));
					return;
				}
				levelFrame = requestAnimationFrame(tick);
			};
			levelFrame = requestAnimationFrame(tick);
		});

	// unmounted mid-animation: do not leave the book waiting
	onMount(() => endLevelUp);

	// the "x3" badge: label row -> centre (pop) -> hold -> back to the row
	const badge = $derived.by(() => {
		if (!levelUp) return null;
		const { time, group } = levelUp;
		const hold = holdOf(levelUp);
		const peak = levelUp.max ? 1.3 : 1;
		const label = geometry.labels[group];
		// the label's anchor is its left edge: aim at its middle
		const row = { x: label.x + geometry.mugSize * 0.45, y: label.y };
		const rowScale = (geometry.mugSize * 0.75) / BADGE_FONT;

		if (time < LEVEL_IN) {
			const t = time / LEVEL_IN;
			const e = cubicOut(t);
			return {
				x: lerp(row.x, BOARD_CENTRE.x, e),
				y: lerp(row.y, BOARD_CENTRE.y, e),
				scale: lerp(rowScale, peak * 1.25, backOut(t)),
				alpha: Math.min(t * 3, 1),
			};
		}
		if (time < LEVEL_IN + hold) {
			const t = (time - LEVEL_IN) / hold;
			const settle = 0.25 * Math.max(0, 1 - t * 4); // 1.25 -> 1 in the first quarter
			const breathe = 0.03 * Math.sin(t * Math.PI * 4);
			return { ...BOARD_CENTRE, scale: peak * (1 + settle + breathe), alpha: 1 };
		}
		const t = Math.min((time - LEVEL_IN - hold) / LEVEL_OUT, 1);
		const e = cubicIn(t);
		return {
			x: lerp(BOARD_CENTRE.x, row.x, e),
			y: lerp(BOARD_CENTRE.y, row.y, e),
			scale: lerp(peak, rowScale, e),
			alpha: 1 - Math.max(0, (t - 0.7) / 0.3),
		};
	});

	// "+2 FREE SPINS" under the badge, only while it stays in the centre
	const spinsAlpha = $derived.by(() => {
		if (!levelUp) return 0;
		const t = levelUp.time - LEVEL_IN;
		const hold = holdOf(levelUp);
		return Math.max(0, Math.min(t / 150, (hold - t) / 120, 1));
	});

	// dark veil over the reels, so the badge reads on any symbols
	const veilAlpha = $derived.by(() => {
		if (!levelUp) return 0;
		const total = LEVEL_IN + holdOf(levelUp) + LEVEL_OUT;
		return 0.45 * Math.max(0, Math.min(levelUp.time / LEVEL_IN, (total - levelUp.time) / LEVEL_OUT, 1));
	});

	const bubbles = $derived.by(() => {
		const up = levelUp;
		if (!up) return [];
		return burst.slice(0, up.max ? BURST_COUNT_MAX : BURST_COUNT).map((bubble) => {
			// starts when the badge reaches the centre
			const t = (up.time - LEVEL_IN * 0.8 - bubble.delay) / BURST_TIME;
			if (t <= 0 || t >= 1) return { ...bubble, x: 0, y: 0, alpha: 0, scale: 1 };
			const e = cubicOut(t);
			return {
				...bubble,
				x: BOARD_CENTRE.x + bubble.dx * e,
				// foam floats up as it spreads
				y: BOARD_CENTRE.y + bubble.dy * e - t * SYMBOL_SIZE * 0.4,
				alpha: 1 - t * t,
				scale: 1 + t * 0.5,
			};
		});
	});

	context.eventEmitter.subscribeOnMount({
		bellyMeterShow: () => (show = true),
		bellyMeterHide: () => (show = false),
		bellyMeterSet: (emitterEvent) => {
			filled = Math.min(emitterEvent.mugs, SLOT_COUNT);
			level = emitterEvent.level;
		},
		bellyMeterDrink: async (emitterEvent) => {
			context.eventEmitter.broadcast({ type: 'mascotPlay', clip: 'drink' });
			const firstSlot = filled;
			await Promise.all(
				emitterEvent.positions.map(async (position, i) => {
					await waitForTimeout(timed(i * 120));
					await drinkOne(position, i, firstSlot + i);
				}),
			);
			filled = Math.min(emitterEvent.mugs, SLOT_COUNT);
			if (emitterEvent.levelUp) {
				level = emitterEvent.level;
				context.eventEmitter.broadcast({ type: 'mascotPlay', clip: 'cheer' });
				await celebrate(Math.min(level, MULTIPLIERS.length) - 1);
			}
		},
	});
</script>

<FadeContainer {show}>
	<BoardContainer>
		<!-- dark backing: the mugs and the counter must not blend into the pub background -->
		<Rectangle {...geometry.backing} {...FREE_SPIN_PANEL_STYLE} />

		{#each MULTIPLIERS as multiplier, group}
			<Text
				anchor={{ x: 0, y: 0.5 }}
				x={geometry.labels[group].x}
				y={geometry.labels[group].y}
				alpha={level > group ? 1 : 0.45}
				scale={level === group + 1 ? 1.15 * labelPunch.current : 1}
				text={`x${multiplier}`}
				style={titleTextStyle(geometry.mugSize * 0.75)}
			/>
		{/each}

		{#each geometry.slots as { x, y }, index}
			<Sprite
				key="h5.webp"
				anchor={0.5}
				{x}
				{y}
				width={geometry.mugSize * (flashIndex === index ? 1.35 : 1)}
				height={geometry.mugSize * (flashIndex === index ? 1.35 : 1)}
				alpha={index < filled ? 1 : EMPTY_ALPHA}
			/>
		{/each}

		{#each flying as mug (mug.id)}
			<Container x={mug.x.current} y={mug.y.current}>
				<Sprite key="h5.webp" anchor={0.5} width={SYMBOL_SIZE * 0.8} height={SYMBOL_SIZE * 0.8} />
			</Container>
		{/each}

		<!-- new multiplier; always mounted (a node added later would be drawn on top) -->
		<Rectangle
			width={BOARD_SIZES.width}
			height={BOARD_SIZES.height}
			backgroundColor={0x000000}
			backgroundAlpha={1}
			alpha={veilAlpha}
			visible={veilAlpha > 0}
		/>
		<GoldGlow
			show={spinsAlpha > 0}
			x={BOARD_CENTRE.x}
			y={BOARD_CENTRE.y}
			width={SYMBOL_SIZE * (levelUp?.max ? 4.5 : 3.6)}
			height={SYMBOL_SIZE * (levelUp?.max ? 3.4 : 2.7)}
		/>
		{#each burst as _bubble, index}
			{@const bubble = bubbles[index]}
			<Circle
				anchor={0.5}
				diameter={burst[index].diameter}
				x={bubble?.x ?? 0}
				y={bubble?.y ?? 0}
				alpha={bubble?.alpha ?? 0}
				visible={(bubble?.alpha ?? 0) > 0}
				scale={bubble?.scale ?? 1}
				backgroundColor={FOAM_COLOR}
				backgroundAlpha={0.35}
				borderColor={0xffffff}
				borderAlpha={0.8}
				borderWidth={2}
			/>
		{/each}
		<Container
			x={badge?.x ?? 0}
			y={badge?.y ?? 0}
			scale={badge?.scale ?? 1}
			alpha={badge?.alpha ?? 0}
			visible={badge !== null}
		>
			<TitleText
				text={`x${MULTIPLIERS[levelUp?.group ?? 0]}`}
				fontSize={BADGE_FONT}
				maxWidth={BOARD_SIZES.width}
			/>
		</Container>
		<TitleText
			text={`+${SPINS_PER_LEVEL} ${i18nDerived.freeSpins()}`}
			fontSize={SYMBOL_SIZE * 0.3}
			fill={TITLE_CREAM}
			font="game"
			maxWidth={BOARD_SIZES.width * 0.8}
			x={BOARD_CENTRE.x}
			y={BOARD_CENTRE.y + SYMBOL_SIZE * (levelUp?.max ? 0.95 : 0.8)}
			alpha={spinsAlpha}
		/>
	</BoardContainer>
</FadeContainer>
