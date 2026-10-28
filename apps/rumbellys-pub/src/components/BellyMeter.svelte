<script lang="ts" module>
	import type { Position } from '../game/types';

	export type EmitterEventBellyMeter =
		| { type: 'bellyMeterShow' }
		| { type: 'bellyMeterHide' }
		| { type: 'bellyMeterSet'; mugs: number; level: number }
		| { type: 'bellyMeterDrink'; positions: Position[]; mugs: number; level: number; levelUp: boolean };
</script>

<script lang="ts">
	import _ from 'lodash';
	import { Tween } from 'svelte/motion';
	import { cubicIn } from 'svelte/easing';

	import { BitmapText, Container, Sprite } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { stateBetDerived } from 'state-shared';
	import { waitForTimeout } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { BOARD_SIZES, SYMBOL_SIZE } from '../game/constants';
	import { getSymbolX, getSymbolY } from '../game/utils';

	// Rumbelly's Belly: 4 groups of 4 mugs, each group unlocks the next multiplier.
	const MUGS_PER_LEVEL = 4;
	const MULTIPLIERS = [2, 3, 5, 10];
	const SLOT_COUNT = MULTIPLIERS.length * MUGS_PER_LEVEL;
	const EMPTY_ALPHA = 0.3;
	const FLY_DURATION = 450;

	type Point = { x: number; y: number };
	type Geometry = { mugSize: number; slots: Point[]; labels: Point[] };

	// desktop / landscape: left of the reels, under the free spin counter; groups fill from the bottom up
	const sideGeometry = (): Geometry => {
		const mugSize = SYMBOL_SIZE * 0.36;
		const gap = mugSize * 1.08;
		const rowHeight = mugSize * 1.2;
		const meterX = -(gap * MUGS_PER_LEVEL + SYMBOL_SIZE * 0.55) - SYMBOL_SIZE * 0.35;
		const meterY = SYMBOL_SIZE * 1.55;
		const rowY = (group: number) =>
			meterY + (MULTIPLIERS.length - 1 - group) * rowHeight + mugSize / 2;
		return {
			mugSize,
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
		return {
			mugSize,
			slots: _.range(SLOT_COUNT).map((index) => ({
				x: groupX(Math.floor(index / MUGS_PER_LEVEL)) + (index % MUGS_PER_LEVEL) * gap + mugSize / 2,
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
	const geometry = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait' ? STRIP : SIDE,
	);

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
			y: new Tween(getSymbolY(position.row - 1), { duration: timed(FLY_DURATION), easing: cubicIn }),
		};
		flying.push(mug);
		await Promise.all([mug.x.set(target.x), mug.y.set(target.y)]);
		flying = flying.filter((m) => m.id !== id);

		flashIndex = slotIndex;
		filled = Math.min(Math.max(filled, slotIndex + 1), SLOT_COUNT);
		await waitForTimeout(timed(180));
		if (flashIndex === slotIndex) flashIndex = -1;
	};

	context.eventEmitter.subscribeOnMount({
		bellyMeterShow: () => (show = true),
		bellyMeterHide: () => (show = false),
		bellyMeterSet: (emitterEvent) => {
			filled = Math.min(emitterEvent.mugs, SLOT_COUNT);
			level = emitterEvent.level;
		},
		bellyMeterDrink: async (emitterEvent) => {
			context.eventEmitter.broadcast({ type: 'mascotDrink' });
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
				context.eventEmitter.broadcast({ type: 'mascotCheer' });
				await waitForTimeout(timed(600));
			}
		},
	});
</script>

<FadeContainer {show}>
	<BoardContainer>
		{#each MULTIPLIERS as multiplier, group}
			<BitmapText
				anchor={{ x: 0, y: 0.5 }}
				x={geometry.labels[group].x}
				y={geometry.labels[group].y}
				alpha={level > group ? 1 : 0.45}
				scale={level === group + 1 ? 1.15 : 1}
				text={`x${multiplier}`}
				style={{ fontFamily: 'gold', fontSize: geometry.mugSize * 0.75 }}
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
	</BoardContainer>
</FadeContainer>
