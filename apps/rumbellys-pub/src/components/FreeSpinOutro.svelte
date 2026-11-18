<script lang="ts" module>
	import type { WinLevelData } from '../game/winLevelMap';

	export type EmitterEventFreeSpinOutro =
		| { type: 'freeSpinOutroShow' }
		| { type: 'freeSpinOutroHide' }
		| { type: 'freeSpinOutroCountUp'; amount: number; winLevelData: WinLevelData };
</script>

<script lang="ts">
	import { FadeContainer, WinCountUpProvider } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { waitForResolve } from 'utils-shared/wait';
	import { CanvasSizeRectangle } from 'components-layout';
	import { OnMount } from 'components-shared';

	import { getContext } from '../game/context';
	import { TITLE_CREAM } from '../game/constants';
	import { i18nDerived } from '../i18n/i18nDerived';
	import FreeSpinAnimation, { FS_PANEL_TEXT } from './FreeSpinAnimation.svelte';
	import TitleText from './TitleText.svelte';
	import PressToContinue from './PressToContinue.svelte';
	import WinCoins from './WinCoins.svelte';

	const context = getContext();

	let show = $state(true);
	let amount = $state(0);
	let winLevelData = $state<WinLevelData>();
	let oncomplete = $state(() => {});
	let onCountUpComplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinOutroShow: () => (show = true),
		freeSpinOutroHide: async () => (show = false),
		freeSpinOutroCountUp: async (emitterEvent) => {
			amount = emitterEvent.amount;
			winLevelData = emitterEvent.winLevelData;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	{#if winLevelData}
		{@const duration = winLevelData.presentDuration}
		<WinCountUpProvider {amount} {duration} oncomplete={() => onCountUpComplete()}>
			{#snippet children({ countUpAmount, startCountUp, finishCountUp, countUpCompleted })}
				<OnMount onmount={() => startCountUp()} />

				<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

				<FreeSpinAnimation>
					{#snippet children()}
						<!-- RUMBELLY'S ROUNDS / YOU WON / amount / TOTAL WIN -->
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
							text={bookEventAmountToCurrencyString(countUpAmount)}
							y={FS_PANEL_TEXT.number.y}
							fontSize={FS_PANEL_TEXT.number.fontSize * 0.8}
							maxWidth={FS_PANEL_TEXT.maxWidth}
						/>

						<TitleText
							text={i18nDerived.totalWin()}
							{...FS_PANEL_TEXT.bottom}
							fill={TITLE_CREAM}
							font="game"
							maxWidth={FS_PANEL_TEXT.maxWidth}
						/>
					{/snippet}
				</FreeSpinAnimation>

				<WinCoins emit={!countUpCompleted} levelAlias={winLevelData?.alias} />

				<PressToContinue onpress={() => (countUpCompleted ? oncomplete() : finishCountUp())} />
			{/snippet}
		</WinCountUpProvider>
	{/if}
</FadeContainer>
