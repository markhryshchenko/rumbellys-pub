<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button, type ButtonProps } from 'components-pixi';

	import UiRound from './UiRound.svelte';
	import UiIcon from './UiIcon.svelte';
	import type { ButtonIcon } from '../types';
	import { UI_COLORS } from '../constants';

	type Props = Omit<ButtonProps, 'children'> & {
		icon: ButtonIcon;
		sizes: { width: number; height: number };
		active?: boolean;
		children?: Snippet;
		variant?: 'dark' | 'light';
	};

	const {
		icon,
		active,
		variant = 'dark',
		children: childrenFromParent,
		...buttonProps
	}: Props = $props();

	const diameter = $derived(Math.min(buttonProps.sizes.width, buttonProps.sizes.height) * 0.8);
</script>

<Button {...buttonProps}>
	{#snippet children({ center, hovered, pressed })}
		<UiRound
			{...center}
			{diameter}
			{hovered}
			{pressed}
			{active}
			disabled={buttonProps.disabled}
			fillAlpha={variant === 'light' ? 0.7 : UI_COLORS.fillAlpha}
		>
			<UiIcon name={icon} size={diameter * 0.55} color={active ? UI_COLORS.accent : UI_COLORS.icon} />
		</UiRound>

		{@render childrenFromParent?.()}
	{/snippet}
</Button>
