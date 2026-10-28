<script lang="ts">
	import { Container, Rectangle, Sprite } from 'pixi-svelte';

	import LanternGlow from './LanternGlow.svelte';
	import { getContext } from '../game/context';
	import { BACKGROUND_RATIO } from '../game/stateLayout';

	const context = getContext();

	const portrait = $derived(context.stateLayoutDerived.layoutType() === 'portrait');

	// cover the whole canvas, keep the image ratio, crop what does not fit
	const cover = $derived.by(() => {
		const canvas = context.stateLayoutDerived.canvasSizes();
		const ratio = portrait ? BACKGROUND_RATIO.portrait : BACKGROUND_RATIO.normal;
		const fitHeight = canvas.width / canvas.height < ratio;
		return {
			x: canvas.width / 2,
			y: canvas.height / 2,
			width: fitHeight ? canvas.height * ratio : canvas.width,
			height: fitHeight ? canvas.height : canvas.width / ratio,
		};
	});
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<Container zIndex={-2}>
	<Sprite key={portrait ? 'backgroundPortrait' : 'backgroundLandscape'} anchor={0.5} {...cover} />
	<LanternGlow {cover} {portrait} />
</Container>
