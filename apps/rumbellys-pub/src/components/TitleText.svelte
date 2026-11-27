<script lang="ts">
	import { Container, Text, type Sizes } from 'pixi-svelte';

	import { GAME_FONT_FAMILY, TITLE_GOLD, titleTextStyle } from '../game/constants';

	// One centred line; long translations shrink to maxWidth.
	// font "title": the game sign font (New Rocker); "game": the UI font, bold (like the free spin counter).
	type Props = {
		text: string | number;
		fontSize: number;
		maxWidth: number;
		fill?: number;
		font?: 'title' | 'game';
		x?: number;
		y?: number;
		alpha?: number; // 0 hides it
	};

	const props: Props = $props();

	let sizes: Sizes = $state({ width: 0, height: 0 });
	const scale = $derived(sizes.width > props.maxWidth ? props.maxWidth / sizes.width : 1);
	const style = $derived({
		...titleTextStyle(props.fontSize, props.fill ?? TITLE_GOLD),
		...(props.font === 'game' ? { fontFamily: GAME_FONT_FAMILY, fontWeight: 'bold' as const } : {}),
	});
</script>

<Container
	x={props.x ?? 0}
	y={props.y ?? 0}
	{scale}
	alpha={props.alpha ?? 1}
	visible={(props.alpha ?? 1) > 0}
>
	<Text
		anchor={0.5}
		text={props.text}
		{style}
		onresize={(newSizes) => (sizes = newSizes)}
	/>
</Container>
