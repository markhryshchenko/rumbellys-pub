<script lang="ts">
	import { Container, Sprite, Text } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { getContextLayout } from 'utils-layout';
	import { stateModal, stateBet, stateBetDerived, stateMetaDerived, stateUi } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import UiRound from './UiRound.svelte';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE, UI_COLORS } from '../constants';
	import { getContext } from '../context';
	import { i18nDerived } from '../i18n/i18nDerived';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const { stateXstateDerived, eventEmitter } = getContext();
	const { stateLayoutDerived } = getContextLayout();

	// desktop: a cloth banner hanging left of the reels (Pragmatic-style); mobile: a round button.
	// The banner art ("buyBonusBanner" in the game's assets) is blank, the text is drawn here.
	const banner = $derived(stateLayoutDerived.layoutType() === 'desktop');
	const BANNER_ASPECT = 495 / 640; // banner.webp
	const BANNER = { width: UI_BASE_SIZE * 1.75, height: (UI_BASE_SIZE * 1.75) / BANNER_ASPECT };
	const sizes = $derived(banner ? BANNER : { width: UI_BASE_SIZE, height: UI_BASE_SIZE });

	const disabled = $derived(!stateXstateDerived.isIdle());
	const active = $derived(stateBetDerived.activeBetMode()?.type === 'activate');
	const buyMode = $derived(stateMetaDerived.betModeMetaList().find((mode) => mode.type === 'buy'));
	const price = $derived(
		buyMode ? numberToCurrencyString(stateBet.betAmount * buyMode.costMultiplier) : '',
	);

	const openModal = () => (stateModal.modal = { name: 'buyBonus' });
	const disableActiveBetMode = () => (stateBet.activeBetModeKey = 'BASE');
	const onpress = () => {
		eventEmitter.broadcast({ type: 'soundPressGeneral' });

		if (active) {
			disableActiveBetMode();
		} else {
			openModal();
		}
	};

	const getState = (value: {
		active: boolean;
		disabled: boolean;
		hovered: boolean;
		pressed: boolean;
	}) => {
		if (value.disabled) return 'disabled' as const;
		if (value.pressed) return 'pressed' as const;
		if (value.hovered) return 'hovered' as const;
		if (value.active) return 'active' as const;
		return 'default' as const;
	};

	const textStyle = (size: number, fill: number) => ({
		align: 'center' as const,
		wordWrap: true,
		wordWrapWidth: BANNER.width * 0.8,
		fontFamily: 'proxima-nova',
		fontWeight: '800' as const,
		fontSize: size,
		lineHeight: size * 1.05,
		fill,
		dropShadow: { color: 0x000000, alpha: 0.6, blur: 2, distance: 2, angle: Math.PI / 2 },
	});
</script>

{#if !(banner && stateUi.freeSpinCounterShow)}
	<Button {...props} {sizes} {disabled} {onpress}>
		{#snippet children({ center, hovered, pressed })}
			{@const state = getState({
				active,
				disabled,
				hovered,
				pressed,
			})}
			{@const label = state === 'active' ? i18nDerived.disable() : i18nDerived.buyBonus()}

			{#if banner}
				<!-- hover: grows a little; pressed: shrinks; bonus mode on: darker cloth -->
				<Container
					x={center.x}
					alpha={disabled ? 0.5 : 1}
					scale={pressed ? 0.97 : hovered ? 1.03 : 1}
				>
					<Sprite
						key="buyBonusBanner"
						anchor={{ x: 0.5, y: 0 }}
						width={BANNER.width}
						height={BANNER.height}
						tint={active ? 0x777777 : 0xffffff}
					/>
					<Text
						y={BANNER.height * 0.42}
						anchor={0.5}
						text={label}
						style={textStyle(UI_BASE_FONT_SIZE * 0.9, UI_COLORS.icon)}
					/>
					<Text
						y={BANNER.height * 0.62}
						anchor={0.5}
						text={price}
						style={textStyle(UI_BASE_FONT_SIZE * 0.8, UI_COLORS.accent)}
					/>
				</Container>
			{:else}
				<!-- buys the free spins ("Rumbelly's Belly"); text comes from i18n, so social mode says "PLAY" -->
				<UiRound
					{...center}
					diameter={sizes.width * 0.9}
					{hovered}
					{pressed}
					active
					{disabled}
					fillColor={active ? UI_COLORS.fill : UI_COLORS.bonusFill}
					fillAlpha={0.92}
				>
					<Text
						anchor={0.5}
						text={label}
						style={{
							align: 'center',
							wordWrap: true,
							wordWrapWidth: sizes.width * 0.7,
							fontFamily: 'proxima-nova',
							fontWeight: '800',
							fontSize: UI_BASE_FONT_SIZE * 0.62,
							lineHeight: UI_BASE_FONT_SIZE * 0.66,
							fill: UI_COLORS.icon,
						}}
					/>
				</UiRound>
			{/if}
		{/snippet}
	</Button>
{/if}
