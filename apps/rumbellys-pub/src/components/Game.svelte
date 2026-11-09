<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM } from 'pixi-svelte';
	import { stateMeta, stateModal, stateUrlDerived } from 'state-shared';

	import { UI, UiClock, UiGameName } from 'components-ui-pixi';
	import { GameVersion, Modals } from 'components-ui-html';

	import { getContext } from '../game/context';
	import { BET_MODE_META } from '../game/betModes';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import ReplayControls from './ReplayControls.svelte';
	import PayTable from './info/PayTable.svelte';
	import GameRules from './info/GameRules.svelte';
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
	import Parrot from './Parrot.svelte';
	import Transition from './Transition.svelte';

	const context = getContext();

	// our bet modes replace the SDK sample ones (boosts, super bonus, remote images)
	stateMeta.betModeMeta = BET_MODE_META;

	const studioNamePosition = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait'
			? { x: context.stateLayoutDerived.canvasSizes().width - REM, y: REM * 0.6, anchor: { x: 1, y: 0 } }
			: { x: REM, y: context.stateLayoutDerived.canvasSizes().height - REM * 0.6, anchor: { x: 0, y: 1 } },
	);

	// bottom right; in portrait the bet buttons take the bottom, so it goes under the studio name
	const clockPosition = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait'
			? { x: context.stateLayoutDerived.canvasSizes().width - REM, y: REM * 1.8, anchor: { x: 1, y: 0 } }
			: {
					x: context.stateLayoutDerived.canvasSizes().width - REM,
					y: context.stateLayoutDerived.canvasSizes().height - REM * 0.6,
					anchor: { x: 1, y: 1 },
				},
	);

	// the studio name and the clock share one look
	const cornerTextProps = {
		alpha: 0.75,
		style: {
			fontFamily: 'proxima-nova',
			fontSize: REM * 0.85,
			fontWeight: '300',
			letterSpacing: REM * 0.1,
			fill: 0xffffff,
		},
	} as const;

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

		<Parrot />

		<UI>
			{#snippet gameName()}
				<UiGameName name="RUMBELLY'S PUB" showClock={false} />
			{/snippet}
			{#snippet logo()}{/snippet}
		</UI>

		<!-- studio name: bottom left (like "PRAGMATIC PLAY"); top right in portrait, where the bet buttons take the bottom -->
		<Text {...studioNamePosition} {...cornerTextProps} text="TALUS PLAY" />
		<UiClock {...clockPosition} {...cornerTextProps} />
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
	{#snippet payTable()}
		<PayTable />
	{/snippet}
	{#snippet gameRules()}
		<GameRules />
	{/snippet}
</Modals>

{#if stateUrlDerived.replay() && !context.stateLayout.showLoadingScreen}
	<ReplayControls />
{/if}
