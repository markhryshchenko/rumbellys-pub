<script lang="ts">
	import { CanvasTextMetrics, TextStyle } from 'pixi.js';
	import { Text } from 'pixi-svelte';
	import { UI_FONT_FAMILY } from 'constants-shared/font';

	import { UI_BASE_FONT_SIZE, UI_COLORS } from '../constants';

	// Pragmatic-style label: gold caption, white amount, no background box.
	type Props = {
		label: string;
		value: string;
		tiled?: boolean;
		stacked?: boolean;
		// the amount's font gets smaller when the text is wider than this
		valueMaxWidth?: number;
	};

	const props: Props = $props();

	const shadow = { color: 0x000000, alpha: 0.85, blur: 4, distance: 2, angle: Math.PI / 2 };

	const labelStyle = {
		fontFamily: UI_FONT_FAMILY,
		fontWeight: '400',
		fontSize: UI_BASE_FONT_SIZE * 0.8 - 2,
		fill: UI_COLORS.accent,
		dropShadow: shadow,
	} as const;

	const valueStyleBase = {
		fontFamily: UI_FONT_FAMILY,
		fontWeight: '700',
		fontSize: UI_BASE_FONT_SIZE,
		fill: UI_COLORS.icon,
		dropShadow: shadow,
	} as const;
	const valueMeasureStyle = new TextStyle(valueStyleBase);

	// long amounts (big balance / big win) shrink to fit, short ones keep the normal size
	const valueStyle = $derived.by(() => {
		if (!props.valueMaxWidth) return valueStyleBase;
		const width = CanvasTextMetrics.measureText(props.value, valueMeasureStyle).width;
		if (width <= props.valueMaxWidth) return valueStyleBase;
		return { ...valueStyleBase, fontSize: (UI_BASE_FONT_SIZE * props.valueMaxWidth) / width };
	});
</script>

{#if props.stacked}
	<Text anchor={{ x: 0.5, y: 0 }} text={props.label} style={labelStyle} />
	<!-- a smaller amount stays on the same middle line -->
	<Text
		anchor={{ x: 0.5, y: 0.5 }}
		text={props.value}
		style={valueStyle}
		y={UI_BASE_FONT_SIZE * 1.6}
	/>
{:else}
	<!-- one line, values of stacked labels (balance / bet) start in the same column -->
	<Text anchor={{ x: 0, y: 0.5 }} text={props.label} style={labelStyle} />
	<Text anchor={{ x: 0, y: 0.5 }} text={props.value} style={valueStyle} x={UI_BASE_FONT_SIZE * 4.6} />
{/if}
