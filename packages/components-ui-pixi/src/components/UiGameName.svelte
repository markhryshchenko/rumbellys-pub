<script lang="ts">
	import { Text, REM } from 'pixi-svelte';
	import { WHITE } from 'constants-shared/colors';

	import UiClock from './UiClock.svelte';

	type Props = {
		name: string;
		// games that place the clock elsewhere (with UiClock) turn it off here
		showClock?: boolean;
	};

	const { name, showClock = true }: Props = $props();
	const textProps = {
		style: {
			fontFamily: 'proxima-nova',
			fontSize: REM * 1.5,
			fontWeight: '600',
			lineHeight: REM * 2,
			fill: WHITE,
		},
	} as const;

	let clockSizes = $state({ width: 0, height: 0 });
</script>

{#if showClock}
	<UiClock onresize={(value) => (clockSizes = value)} {...textProps} />
{/if}
<Text text={name} x={showClock ? clockSizes.width + 5 : 0} {...textProps} />
