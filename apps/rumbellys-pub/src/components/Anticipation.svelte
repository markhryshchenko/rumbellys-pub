<script lang="ts">
	import { onMount } from 'svelte';
	import _ from 'lodash';

	import { Circle } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import GoldGlow from './GoldGlow.svelte';
	import { getContext } from '../game/context';
	import type { Reel } from '../game/stateGame.svelte';
	import { BOARD_SIZES, REEL_PADDING, SYMBOL_SIZE } from '../game/constants';

	type Props = {
		reel: Reel;
		oncomplete: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	// Scatter anticipation: beer foam bubbles rise through the reel column over a warm gold glow.
	// Drawn in code, no art.
	const BUBBLE_COUNT = 36;
	const RISE_TIME = 1600; // ms for an average bubble to cross the column
	const INTRO_TIME = 300; // ms, bubbles fade in
	const POP_TIME = 250; // ms, bubbles pop when the reel stops
	const OUT_TIME = 400; // ms after the stop, then oncomplete
	const COLUMN_WIDTH = SYMBOL_SIZE * 0.8; // where bubbles can be
	const COLUMN_HEIGHT = BOARD_SIZES.height;
	const FOAM_COLOR = 0xfff1d6;

	type Bubble = {
		x: number; // -0.5..0.5 of the column width
		diameter: number;
		speed: number; // 1 = average
		phase: number; // 0..1, start height along the column
		wobble: number; // rad, sway phase
	};

	const bubbles: Bubble[] = _.times(BUBBLE_COUNT, () => ({
		x: _.random(-0.5, 0.5, true),
		diameter: _.random(SYMBOL_SIZE * 0.06, SYMBOL_SIZE * 0.16, true),
		speed: _.random(0.7, 1.4, true),
		phase: _.random(0, 1, true),
		wobble: _.random(0, Math.PI * 2, true),
	}));

	// game time (ms) runs faster in turbo
	let time = $state(0);
	// time when the reel stopped (null: still spinning)
	let stopTime = $state<number | null>(null);

	$effect(() => {
		if (props.reel.reelState.motion === 'stopped' && stopTime === null) {
			stopTime = time;
		}
	});

	const centre = $derived({
		x:
			context.stateGameDerived.boardLayout().x -
			context.stateGameDerived.boardLayout().width * 0.5 +
			(props.reel.reelIndex + REEL_PADDING) * SYMBOL_SIZE,
		y: context.stateGameDerived.boardLayout().y,
	});

	// position of one bubble at the current time
	const place = (bubble: Bubble) => {
		// progress up the column: 0 = bottom, 1 = top; frozen once the reel stops
		const at = stopTime ?? time;
		const progress = (bubble.phase + (at / RISE_TIME) * bubble.speed) % 1;
		const sway = Math.sin(bubble.wobble + (at / 1000) * 5) * SYMBOL_SIZE * 0.06;

		// fade in at the start, fade out near the top and the bottom
		const intro = Math.min(time / INTRO_TIME, 1);
		const edges = Math.min(progress / 0.1, (1 - progress) / 0.15, 1);
		// pop: grow and vanish
		const pop = stopTime === null ? 0 : Math.min((time - stopTime) / POP_TIME, 1);

		return {
			x: centre.x + bubble.x * COLUMN_WIDTH + sway,
			y: centre.y + COLUMN_HEIGHT * (0.5 - progress),
			alpha: intro * edges * (1 - pop),
			scale: 1 + pop * 0.6,
		};
	};

	onMount(() => {
		let frame = 0;
		let last = 0;
		let done = false;

		const tick = (now: number) => {
			if (last) time += (now - last) * stateBetDerived.timeScale();
			last = now;

			if (stopTime !== null && time - stopTime >= OUT_TIME) {
				done = true;
				props.oncomplete();
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			// unmounted early (e.g. story switched): let the reel state finish anyway
			if (!done) props.oncomplete();
		};
	});
</script>

<!-- glow first: drawn under the bubbles -->
<GoldGlow
	show={stopTime === null}
	x={centre.x}
	y={centre.y}
	width={SYMBOL_SIZE * 1.6}
	height={COLUMN_HEIGHT * 1.25}
/>

{#each bubbles as bubble}
	{@const p = place(bubble)}
	<Circle
		anchor={0.5}
		diameter={bubble.diameter}
		x={p.x}
		y={p.y}
		alpha={p.alpha}
		visible={p.alpha > 0}
		scale={p.scale}
		backgroundColor={FOAM_COLOR}
		backgroundAlpha={0.35}
		borderColor={0xffffff}
		borderAlpha={0.8}
		borderWidth={2}
	/>
{/each}
