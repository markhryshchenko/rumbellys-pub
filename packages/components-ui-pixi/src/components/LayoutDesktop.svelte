<script lang="ts">
	import { stateUi } from 'state-shared';
	import { BLACK } from 'constants-shared/colors';
	import { MainContainer } from 'components-layout';
	import { Container, Rectangle } from 'pixi-svelte';

	import { getContext } from '../context';
	import type { LayoutUiProps } from '../types';

	const props: LayoutUiProps = $props();
	const context = getContext();

	// Pragmatic-style desktop layout, in the standard 1920x1080 space (bottom aligned):
	// small menu / sound / info + balance and bet bottom left, win in the centre,
	// big spin bottom right with - / + beside it and autoplay / turbo under it,
	// buy-bonus banner hanging left of the reels.
	const ROW_Y = 950;
	const SPIN = { x: 1700, y: ROW_Y };
	const MENU = { x: 60, y: ROW_Y - 5 };
</script>

<Container x={20}>
	{@render props.gameName()}
</Container>

<Container x={context.stateLayoutDerived.canvasSizes().width - 20}>
	{@render props.logo()}
</Container>

<MainContainer standard alignVertical="bottom">
	<Container x={235} y={270}>
		{@render props.buttonBuyBonus({ anchor: { x: 0.5, y: 0 } })}
	</Container>

	<!-- bottom left -->
	<Container {...MENU} scale={0.5}>
		{@render props.buttonMenu({ anchor: 0.5 })}
	</Container>

	<Container x={MENU.x} y={MENU.y + 62} scale={0.38}>
		{@render props.buttonSoundSwitch({ anchor: 0.5 })}
	</Container>

	<Container x={140} y={ROW_Y + 28} scale={0.4}>
		{@render props.buttonGameRules({ anchor: 0.5 })}
	</Container>

	<Container x={215} y={ROW_Y + 5} scale={0.8}>
		{@render props.amountBalance({ stacked: false })}
	</Container>

	<Container x={215} y={ROW_Y + 55} scale={0.8}>
		{@render props.amountBet({ stacked: false })}
	</Container>

	<!-- centre -->
	<Container x={960} y={ROW_Y - 15} scale={0.8}>
		{@render props.amountWin({ stacked: true })}
	</Container>

	<!-- bottom right -->
	<Container x={SPIN.x - 135} y={SPIN.y} scale={0.55}>
		{@render props.buttonDecrease({ anchor: 0.5 })}
	</Container>

	<Container {...SPIN}>
		{@render props.buttonBet({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x + 135} y={SPIN.y} scale={0.55}>
		{@render props.buttonIncrease({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x - 48} y={SPIN.y + 100} scale={0.42}>
		{@render props.buttonAutoSpin({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x + 48} y={SPIN.y + 100} scale={0.42}>
		{@render props.buttonTurbo({ anchor: 0.5 })}
	</Container>
</MainContainer>

{#if stateUi.menuOpen}
	<Rectangle
		eventMode="static"
		cursor="pointer"
		alpha={0.5}
		anchor={0.5}
		backgroundColor={BLACK}
		width={context.stateLayoutDerived.canvasSizes().width}
		height={context.stateLayoutDerived.canvasSizes().height}
		x={context.stateLayoutDerived.canvasSizes().width * 0.5}
		y={context.stateLayoutDerived.canvasSizes().height * 0.5}
		onpointerup={() => (stateUi.menuOpen = false)}
	/>

	<!-- opens upwards from the menu button -->
	<MainContainer standard alignVertical="bottom">
		<Container x={MENU.x + 20} y={MENU.y}>
			<Container scale={0.6} y={-120 * 4}>
				{@render props.buttonPayTable({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6} y={-120 * 3}>
				{@render props.buttonGameRules({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6} y={-120 * 2}>
				{@render props.buttonSettings({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6} y={-120}>
				{@render props.buttonSoundSwitch({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6}>
				{@render props.buttonMenuClose({ anchor: 0.5 })}
			</Container>
		</Container>
	</MainContainer>
{/if}
