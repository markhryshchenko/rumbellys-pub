<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';

	import { Sprite } from 'pixi-svelte';

	// Warm pulsing lantern glow (the background lantern sprite, tinted gold, added light).
	// Used behind the reel frame in free spins and behind the free spins popup.
	type Props = {
		width: number;
		height: number;
		x?: number;
		y?: number;
		show?: boolean;
		zIndex?: number;
	};

	const props: Props = $props();

	const TINT = 0xffc35a;
	const PULSE_TIME = 1400; // ms, one bright-dim cycle
	const FADE_TIME = 400;

	const visibility = new Tween(0, { duration: FADE_TIME });
	$effect(() => {
		visibility.set(props.show === false ? 0 : 1);
	});

	let time = $state(0);
	const alpha = $derived(
		visibility.current * (0.55 + 0.2 * Math.sin((time / PULSE_TIME) * Math.PI * 2)),
	);

	onMount(() => {
		let frameId = 0;
		const start = performance.now();
		const tick = (now: number) => {
			time = now - start;
			frameId = requestAnimationFrame(tick);
		};
		frameId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frameId);
	});
</script>

<!-- always mounted: a sprite added later would be drawn on top of the frame / popup -->
<Sprite
	key="lanternGlow"
	anchor={0.5}
	blendMode="add"
	tint={TINT}
	{alpha}
	visible={alpha > 0}
	x={props.x ?? 0}
	y={props.y ?? 0}
	width={props.width}
	height={props.height}
	zIndex={props.zIndex}
/>
