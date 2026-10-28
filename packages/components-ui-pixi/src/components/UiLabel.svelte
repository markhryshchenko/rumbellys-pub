<script lang="ts">
	import { Text } from 'pixi-svelte';

	import { UI_BASE_FONT_SIZE, UI_COLORS } from '../constants';

	// Pragmatic-style label: gold caption, white amount, no background box.
	type Props = {
		label: string;
		value: string;
		tiled?: boolean;
		stacked?: boolean;
	};

	const props: Props = $props();

	const shadow = { color: 0x000000, alpha: 0.85, blur: 4, distance: 2, angle: Math.PI / 2 };

	const labelStyle = {
		fontFamily: 'proxima-nova',
		fontWeight: '800',
		fontSize: UI_BASE_FONT_SIZE * 0.8,
		fill: UI_COLORS.accent,
		dropShadow: shadow,
	} as const;

	const valueStyle = {
		fontFamily: 'proxima-nova',
		fontWeight: '700',
		fontSize: UI_BASE_FONT_SIZE,
		fill: UI_COLORS.icon,
		dropShadow: shadow,
	} as const;
</script>

{#if props.stacked}
	<Text anchor={{ x: 0.5, y: 0 }} text={props.label} style={labelStyle} />
	<Text anchor={{ x: 0.5, y: 0 }} text={props.value} style={valueStyle} y={UI_BASE_FONT_SIZE} />
{:else}
	<!-- one line, values of stacked labels (balance / bet) start in the same column -->
	<Text anchor={{ x: 0, y: 0.5 }} text={props.label} style={labelStyle} />
	<Text anchor={{ x: 0, y: 0.5 }} text={props.value} style={valueStyle} x={UI_BASE_FONT_SIZE * 4.6} />
{/if}
