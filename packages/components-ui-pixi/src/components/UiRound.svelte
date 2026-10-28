<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { ContainerProps } from 'pixi-svelte';

	export type Props = Omit<ContainerProps, 'children' | 'scale'> & {
		diameter: number;
		hovered?: boolean;
		pressed?: boolean;
		active?: boolean;
		disabled?: boolean;
		fillColor?: number;
		fillAlpha?: number;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { Circle, Container } from 'pixi-svelte';

	import { UI_COLORS } from '../constants';

	// Pragmatic-style round button: dark see-through disc, white ring, icon on top.
	const {
		diameter,
		hovered,
		pressed,
		active,
		disabled,
		fillColor = UI_COLORS.fill,
		fillAlpha = UI_COLORS.fillAlpha,
		children,
		...containerProps
	}: Props = $props();
</script>

<Container {...containerProps} scale={pressed ? 0.94 : 1} alpha={disabled ? 0.4 : 1}>
	<Circle
		anchor={0.5}
		{diameter}
		backgroundColor={fillColor}
		backgroundAlpha={fillAlpha}
		borderColor={hovered || active ? UI_COLORS.accent : UI_COLORS.ring}
		borderWidth={diameter * 0.03}
	/>
	{@render children?.()}
</Container>
