<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UI, UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import Win from './Win.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import BellyMeter from './BellyMeter.svelte';
	import Mascot from './Mascot.svelte';
	import Transition from './Transition.svelte';

	const context = getContext();

	const studioNamePosition = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait'
			? { x: context.stateLayoutDerived.canvasSizes().width - REM, y: REM * 0.6, anchor: { x: 1, y: 0 } }
			: { x: REM, y: context.stateLayoutDerived.canvasSizes().height - REM * 0.6, anchor: { x: 0, y: 1 } },
	);

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			stateModal.modal = { name: 'buyBonusConfirm' };
		},
	});
</script>

<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

	{#if context.stateLayout.showLoadingScreen}
		<LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
	{:else}
		<ResumeBet />
		<!--
			The reason why <Sound /> is rendered after clicking the loading screen:
			"Autoplay with sound is allowed if: The user has interacted with the domain (click, tap, etc.)."
			Ref: https://developer.chrome.com/blog/autoplay
		-->
		<Sound />

		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<MainContainer>
			<Mascot />
			<Board />
			<Anticipations />
			<BellyMeter />
		</MainContainer>

		<UI>
			{#snippet gameName()}
				<UiGameName name="RUMBELLY'S PUB" />
			{/snippet}
			{#snippet logo()}{/snippet}
		</UI>

		<!-- studio name: bottom left (like "PRAGMATIC PLAY"); top right in portrait, where the bet buttons take the bottom -->
		<Text
			{...studioNamePosition}
			alpha={0.75}
			text="TALUS PLAY"
			style={{
				fontFamily: 'proxima-nova',
				fontSize: REM * 0.85,
				fontWeight: '300',
				letterSpacing: REM * 0.1,
				fill: 0xffffff,
			}}
		/>
		<Win />
		<FreeSpinIntro />
		{#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
			<FreeSpinCounter />
		{/if}
		<FreeSpinOutro />
		<Transition />
	{/if}
</App>

<Modals>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</Modals>
