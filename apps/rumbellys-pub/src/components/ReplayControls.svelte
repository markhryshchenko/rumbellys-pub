<script lang="ts">
	import { stateBet, stateReplay, stateUrlDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import { getContext } from '../game/context';
	import { i18nDerived } from '../i18n/i18nDerived';

	// Engine bet replay: show the bet cost, start the round with Play, watch it again with Play Again.
	const context = getContext();

	const modeName = $derived(i18nDerived.betModeName(stateUrlDerived.mode()));
	const baseAmount = $derived(numberToCurrencyString(stateBet.betAmount));
	const realCost = $derived(numberToCurrencyString(stateBet.betAmount * stateReplay.costMultiplier));
	const canPlay = $derived(stateReplay.status === 'ready' || stateReplay.status === 'done');

	let leftIdle = false;

	const play = () => {
		if (!canPlay || !stateReplay.round) return;
		// a fresh copy every time: the game consumes and clears betToResume
		stateBet.betToResume = structuredClone(
			$state.snapshot(stateReplay.round),
		) as unknown as typeof stateBet.betToResume;
		leftIdle = false;
		stateReplay.status = 'playing';
		context.eventEmitter.broadcast({ type: 'resumeBet' });
	};

	// the replay is over when the game actor has left idle and come back to it
	$effect(() => {
		if (stateReplay.status !== 'playing') return;
		if (context.stateXstate.value !== 'idle') leftIdle = true;
		else if (leftIdle) stateReplay.status = 'done';
	});
</script>

<div class="replay">
	<div class="cost">
		<span>{modeName}: {baseAmount}</span>
		{#if stateReplay.costMultiplier !== 1}
			<span>{i18nDerived.replayRealCost()}: {realCost}</span>
		{/if}
	</div>

	{#if stateReplay.status === 'loading'}
		<span class="note">{i18nDerived.replayLoading()}</span>
	{:else if stateReplay.status === 'error'}
		<span class="note">{i18nDerived.replayUnavailable()}</span>
	{:else if canPlay}
		<button type="button" onclick={play}>
			{stateReplay.status === 'done' ? i18nDerived.replayPlayAgain() : i18nDerived.replayPlay()}
		</button>
	{/if}
</div>

<style>
	.replay {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.75rem;
		background: rgba(20, 12, 8, 0.8);
		color: #fff4dc;
		font-family: sans-serif;
		font-weight: 700;
		font-size: clamp(0.65rem, 2.5vw, 0.9rem);
		white-space: nowrap;
		z-index: 10;
	}

	.cost {
		display: flex;
		flex-direction: column;
		line-height: 1.3;
	}

	.note {
		opacity: 0.8;
	}

	button {
		padding: 0.5rem 1.25rem;
		border: 3px solid #1a0f08;
		border-radius: 0.6rem;
		background: #f2b632;
		color: #1a0f08;
		font: inherit;
		cursor: pointer;
	}
</style>
