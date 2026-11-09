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
	// The bottom row is only as wide as the reel frame + 50 px on each side
	// (visible frame: 960 ± 485 at 1920x1080).
	const ROW_Y = 950;
	const ROW_LEFT = 960 - 485 - 50;
	const ROW_RIGHT = 960 + 485 + 50;
	// size of every button (and the gaps between them); labels are not scaled
	const BUTTON_SCALE = 0.8;
	const S = BUTTON_SCALE;
	const MENU = { x: ROW_LEFT + 30 * S, y: ROW_Y - 5 };
	const SOUND_Y = MENU.y + 62 * S;
	const INFO_X = ROW_LEFT + 100 * S;
	const LABELS_X = ROW_LEFT + 150 * S;
	const WIN_X = 1045; // between the balance / bet values and the "-" button
	const SPIN = { x: ROW_RIGHT - (33 + 135) * S, y: ROW_Y }; // "+" (radius 33 * S) sits on the right edge
</script>

<Container x={20}>
	{@render props.gameName()}
</Container>

<Container x={context.stateLayoutDerived.canvasSizes().width - 20}>
	{@render props.logo()}
</Container>

<MainContainer standard alignVertical="bottom">
	<!-- right edge touches the reel frame's left post (the frame image has a transparent margin) -->
	<Container x={357} y={290}>
		{@render props.buttonBuyBonus({ anchor: { x: 0.5, y: 0 } })}
	</Container>

	<!-- bottom left -->
	<Container {...MENU} scale={0.5 * S}>
		{@render props.buttonMenu({ anchor: 0.5 })}
	</Container>

	<Container x={MENU.x} y={SOUND_Y} scale={0.38 * S}>
		{@render props.buttonSoundSwitch({ anchor: 0.5 })}
	</Container>

	<Container x={INFO_X} y={(MENU.y + SOUND_Y) / 2} scale={0.4 * S}>
		{@render props.buttonGameRules({ anchor: 0.5 })}
	</Container>

	<Container x={LABELS_X} y={ROW_Y + 8} scale={0.7}>
		{@render props.amountBalance({ stacked: false })}
	</Container>

	<Container x={LABELS_X} y={ROW_Y + 52} scale={0.7}>
		{@render props.amountBet({ stacked: false })}
	</Container>

	<!-- centre -->
	<Container x={WIN_X} y={ROW_Y - 15} scale={0.8}>
		{@render props.amountWin({ stacked: true })}
	</Container>

	<!-- bottom right -->
	<Container x={SPIN.x - 135 * S} y={SPIN.y} scale={0.55 * S}>
		{@render props.buttonDecrease({ anchor: 0.5 })}
	</Container>

	<Container {...SPIN} scale={S}>
		{@render props.buttonBet({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x + 135 * S} y={SPIN.y} scale={0.55 * S}>
		{@render props.buttonIncrease({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x - 48 * S} y={SPIN.y + 100 * S} scale={0.42 * S}>
		{@render props.buttonAutoSpin({ anchor: 0.5 })}
	</Container>

	<Container x={SPIN.x + 48 * S} y={SPIN.y + 100 * S} scale={0.42 * S}>
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
		<Container x={MENU.x + 20 * S} y={MENU.y}>
			<Container scale={0.6 * S} y={-120 * S * 4}>
				{@render props.buttonPayTable({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6 * S} y={-120 * S * 3}>
				{@render props.buttonGameRules({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6 * S} y={-120 * S * 2}>
				{@render props.buttonSettings({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6 * S} y={-120 * S}>
				{@render props.buttonSoundSwitch({ anchor: 0.5 })}
			</Container>

			<Container scale={0.6 * S}>
				{@render props.buttonMenuClose({ anchor: 0.5 })}
			</Container>
		</Container>
	</MainContainer>
{/if}
