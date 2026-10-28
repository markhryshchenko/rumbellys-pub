<script lang="ts">
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';

	import { Sprite } from 'pixi-svelte';

	type Props = {
		cover: { x: number; y: number; width: number; height: number };
		portrait: boolean;
	};

	const props: Props = $props();

	// Lantern flames on the background images, as fractions of the image size (centres of the
	// brightest yellow spots). size = glow diameter / image width.
	const LANTERNS = {
		landscape: [
			{ x: 0.156, y: 0.21, size: 0.06 },
			{ x: 0.662, y: 0.264, size: 0.06 },
			{ x: 0.745, y: 0.205, size: 0.07 },
			{ x: 0.87, y: 0.084, size: 0.1 },
		],
		portrait: [
			{ x: 0.391, y: 0.381, size: 0.09 },
			{ x: 0.541, y: 0.351, size: 0.12 },
			{ x: 0.767, y: 0.29, size: 0.17 },
		],
	};
	const GLOW_ALPHA = 0.55;

	const lanterns = $derived(props.portrait ? LANTERNS.portrait : LANTERNS.landscape);

	// one flicker per lantern: brightness and size wander randomly, like a live flame
	const flicker = _.range(LANTERNS.landscape.length).map(() => new Tween(1, { easing: sineInOut }));

	onMount(() => {
		let alive = true;
		flicker.forEach(async (tween) => {
			while (alive) await tween.set(_.random(0.75, 1.1), { duration: _.random(90, 260) });
		});
		return () => (alive = false);
	});
</script>

{#each lanterns as lantern, index}
	{@const size = props.cover.width * lantern.size * flicker[index].current}
	<Sprite
		key="lanternGlow"
		anchor={0.5}
		blendMode="add"
		x={props.cover.x + (lantern.x - 0.5) * props.cover.width}
		y={props.cover.y + (lantern.y - 0.5) * props.cover.height}
		width={size}
		height={size}
		alpha={GLOW_ALPHA * flicker[index].current}
	/>
{/each}
