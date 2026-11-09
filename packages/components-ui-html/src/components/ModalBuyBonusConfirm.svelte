<script lang="ts">
	import { Button, Popup } from 'components-shared';
	import { zIndex } from 'constants-shared/zIndex';
	import { stateBet, stateI18nDerived, stateModal, stateUi, INFINITY_MARK } from 'state-shared';
	import { getContextEventEmitter } from 'utils-event-emitter';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import BaseIcon from './BaseIcon.svelte';
	import BaseTitle from './BaseTitle.svelte';
	import BaseContent from './BaseContent.svelte';
	import BaseScrollable from './BaseScrollable.svelte';
	import BaseButtonWrap from './BaseButtonWrap.svelte';
	import BaseButtonContent from './BaseButtonContent.svelte';
	import { stateBonusDerived } from '../stateBonus.svelte';
	import { i18nDerived } from '../i18n/i18nDerived';
	import type { EmitterEventModal } from '../types';

	const { eventEmitter } = getContextEventEmitter<EmitterEventModal>();

	// bet mode texts are message ids, so they are translated here; {price} is the real cost
	const mode = $derived(stateBonusDerived.selectedBetModeData());
	const cost = $derived(stateBet.betAmount * (mode?.costMultiplier ?? 1));
	const price = $derived(numberToCurrencyString(cost));
	const affordable = $derived(stateBet.betAmount > 0 && cost <= stateBet.balanceAmount);

	const confirm = () => {
		stateBet.activeBetModeKey = mode.mode;

		if (mode.type === 'buy') {
			eventEmitter.broadcast({ type: 'bet' });
		}

		if (mode.type === 'activate') {
			stateUi.autoSpinsLossLimitText = INFINITY_MARK;
			stateUi.autoSpinsSingleWinLimitText = INFINITY_MARK;
		}
	};
</script>

{#if stateModal.modal?.name === 'buyBonusConfirm' && mode}
	<Popup zIndex={zIndex.dialog} onclose={() => (stateModal.modal = null)}>
		<BaseContent maxWidth="500px">
			<BaseTitle>
				{stateI18nDerived.translate(mode.text.title)}
			</BaseTitle>
			<BaseScrollable type="column">
				<span class="dialog">{stateI18nDerived.translate(mode.text.dialog, { price })}</span>
			</BaseScrollable>
			<BaseButtonWrap type="max-width">
				<Button
					data-test="confirm-button"
					disabled={!affordable}
					onclick={() => {
						confirm();
						eventEmitter.broadcast({ type: 'soundPressGeneral' });
						stateModal.modal = null;
					}}
				>
					<BaseIcon width="100%" height="3rem" />
					<BaseButtonContent>
						<span style="font-size: 1rem;">{i18nDerived.confirm()}</span>
					</BaseButtonContent>
				</Button>
			</BaseButtonWrap>
		</BaseContent>
	</Popup>
{/if}

<style lang="scss">
	.dialog {
		text-align: center;
		white-space: pre-line;
	}
</style>
