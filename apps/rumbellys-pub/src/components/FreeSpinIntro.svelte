<script lang="ts" module>
	export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow' }
		| { type: 'freeSpinIntroHide' }
		| { type: 'freeSpinIntroUpdate'; totalFreeSpins: number };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';

	import { getContext } from '../game/context';
	import { TITLE_CREAM } from '../game/constants';
	import { i18nDerived } from '../i18n/i18nDerived';
	import PressToContinue from './PressToContinue.svelte';
	import FreeSpinAnimation, { FS_PANEL_TEXT } from './FreeSpinAnimation.svelte';
	import TitleText from './TitleText.svelte';

	const context = getContext();

	let show = $state(false);
	let freeSpinsFromEvent = $state(0);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: () => {
			show = true;
			context.eventEmitter.broadcast({ type: 'mascotCheer' });
		},
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroUpdate: async (emitterEvent) => {
			freeSpinsFromEvent = emitterEvent.totalFreeSpins;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<!-- RUMBELLY'S ROUNDS / YOU WON / 10 / FREE SPINS: text in the sign font, every language -->
<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

	<FreeSpinAnimation>
		{#snippet children()}
			<TitleText
				text={i18nDerived.bonusName()}
				{...FS_PANEL_TEXT.title}
				maxWidth={FS_PANEL_TEXT.maxWidth}
			/>
			<TitleText
				text={i18nDerived.youWon()}
				{...FS_PANEL_TEXT.subtitle}
				fill={TITLE_CREAM}
				font="game"
				maxWidth={FS_PANEL_TEXT.maxWidth}
			/>

			<TitleText
				text={freeSpinsFromEvent}
				{...FS_PANEL_TEXT.number}
				maxWidth={FS_PANEL_TEXT.maxWidth}
			/>

			<TitleText
				text={i18nDerived.freeSpins()}
				{...FS_PANEL_TEXT.bottom}
				fill={TITLE_CREAM}
				font="game"
				maxWidth={FS_PANEL_TEXT.maxWidth}
			/>
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
