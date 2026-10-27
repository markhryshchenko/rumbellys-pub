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
	import { SYMBOL_SIZE } from '../game/constants';
	import { getSymbolX, getSymbolY } from '../game/utils';

	// Rumbelly's Belly: 4 groups of 4 mugs, each group unlocks the next multiplier.
	const MUGS_PER_LEVEL = 4;
	const MULTIPLIERS = [2, 3, 5, 10];
	const MUG_SIZE = SYMBOL_SIZE * 0.36;
	const MUG_GAP = MUG_SIZE * 1.08;
	const ROW_HEIGHT = MUG_SIZE * 1.2;
	const LABEL_WIDTH = SYMBOL_SIZE * 0.55;
	const METER_WIDTH = MUG_GAP * MUGS_PER_LEVEL + LABEL_WIDTH;
	// left of the reels, under the free spin counter; groups fill from the bottom up
	const METER_X = -METER_WIDTH - SYMBOL_SIZE * 0.35;
	const METER_Y = SYMBOL_SIZE * 1.55;
	const EMPTY_ALPHA = 0.3;
	const FLY_DURATION = 450;

	const context = getContext();

	let show = $state(false);
	let filled = $state(0);
	let level = $state(0);
	let flashIndex = $state(-1);
	let flying = $state<{ id: number; x: Tween<number>; y: Tween<number> }[]>([]);

	const slot = (index: number) => {
		const group = Math.floor(index / MUGS_PER_LEVEL);
		return {
			x: METER_X + (index % MUGS_PER_LEVEL) * MUG_GAP + MUG_SIZE / 2,
			y: METER_Y + (MULTIPLIERS.length - 1 - group) * ROW_HEIGHT + MUG_SIZE / 2,
		};
	};
	const slots = _.range(MULTIPLIERS.length * MUGS_PER_LEVEL).map(slot);

	const timed = (ms: number) => ms / stateBetDerived.timeScale();

	const drinkOne = async (position: Position, id: number, slotIndex: number) => {
		const target = slots[Math.min(slotIndex, slots.length - 1)];
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
		filled = Math.min(Math.max(filled, slotIndex + 1), slots.length);
		await waitForTimeout(timed(180));
		if (flashIndex === slotIndex) flashIndex = -1;
	};

	context.eventEmitter.subscribeOnMount({
		bellyMeterShow: () => (show = true),
		bellyMeterHide: () => (show = false),
		bellyMeterSet: (emitterEvent) => {
			filled = Math.min(emitterEvent.mugs, slots.length);
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
			filled = Math.min(emitterEvent.mugs, slots.length);
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
			{@const rowY = METER_Y + (MULTIPLIERS.length - 1 - group) * ROW_HEIGHT + MUG_SIZE / 2}
			<BitmapText
				anchor={{ x: 0, y: 0.5 }}
				x={METER_X + MUG_GAP * MUGS_PER_LEVEL + MUG_SIZE * 0.2}
				y={rowY}
				alpha={level > group ? 1 : 0.45}
				scale={level === group + 1 ? 1.15 : 1}
				text={`x${multiplier}`}
				style={{ fontFamily: 'gold', fontSize: MUG_SIZE * 0.75 }}
			/>
		{/each}

		{#each slots as { x, y }, index}
			<Sprite
				key="h5.webp"
				anchor={0.5}
				{x}
				{y}
				width={MUG_SIZE * (flashIndex === index ? 1.35 : 1)}
				height={MUG_SIZE * (flashIndex === index ? 1.35 : 1)}
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
