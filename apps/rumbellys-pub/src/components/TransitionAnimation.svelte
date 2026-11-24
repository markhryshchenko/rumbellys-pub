<script lang="ts">
	import { onMount } from 'svelte';
	import _ from 'lodash';

	import { Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';

	type Props = {
		oncomplete: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	// Free spins transition: a shower of rum barrels (our scatter symbol) falls through the screen.
	const BARREL_COUNT = 24;
	const SPAWN_TIME = 700; // ms: barrels start falling during this time
	const GRAVITY = 3.2; // screen heights per second^2
	const BARREL_KEY = 's.png'; // scatter sprite from the symbolsStatic atlas

	type Barrel = {
		delay: number; // ms after the start
		x: number; // share of the screen width
		size: number; // share of the screen height
		speed: number; // start speed, screen heights per second
		drift: number; // horizontal speed, screen widths per second
		spin: number; // rad per second
		rotation: number;
	};

	const barrels: Barrel[] = _.times(BARREL_COUNT, () => ({
		delay: _.random(0, SPAWN_TIME),
		x: _.random(-0.05, 1.05, true),
		size: _.random(0.12, 0.24, true),
		speed: _.random(0.3, 0.8, true),
		drift: _.random(-0.08, 0.08, true),
		spin: _.random(-4, 4, true),
		rotation: _.random(0, Math.PI * 2, true),
	}));

	let time = $state(0); // ms since the start

	const canvas = $derived(context.stateLayoutDerived.canvasSizes());

	// position of one barrel at the current time (null: not started yet)
	const place = (barrel: Barrel) => {
		const t = (time - barrel.delay) / 1000;
		if (t < 0) return null;
		const size = barrel.size * canvas.height;
		return {
			x: (barrel.x + barrel.drift * t) * canvas.width,
			// starts just above the screen
			y: -size + (barrel.speed * t + (GRAVITY * t * t) / 2) * canvas.height,
			size,
			rotation: barrel.rotation + barrel.spin * t,
		};
	};

	onMount(() => {
		let frame = 0;
		let start = 0;
		let done = false;
		// the last barrel is off the screen when its top passes the bottom edge
		const endTime = (() => {
			const fallTimes = barrels.map((barrel) => {
				// solve speed*t + GRAVITY*t^2/2 = 1 + 2*size (screen heights)
				const distance = 1 + 2 * barrel.size;
				const t = (-barrel.speed + Math.sqrt(barrel.speed ** 2 + 2 * GRAVITY * distance)) / GRAVITY;
				return barrel.delay + t * 1000;
			});
			return Math.max(...fallTimes);
		})();

		const tick = (now: number) => {
			if (!start) start = now;
			time = now - start;
			if (time >= endTime) {
				done = true;
				props.oncomplete();
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			// unmounted before the end (e.g. the story was switched): do not leave the book waiting
			if (!done) props.oncomplete();
		};
	});
</script>

{#each barrels as barrel}
	{@const p = place(barrel)}
	{#if p}
		<Sprite
			key={BARREL_KEY}
			anchor={0.5}
			x={p.x}
			y={p.y}
			width={p.size}
			height={p.size}
			rotation={p.rotation}
		/>
	{/if}
{/each}
