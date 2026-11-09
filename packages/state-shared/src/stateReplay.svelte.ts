// Bet replay (?replay=true): the round is loaded once and can be watched again and again.
export type ReplayStatus = 'loading' | 'ready' | 'playing' | 'done' | 'error';

export const stateReplay = $state({
	status: 'loading' as ReplayStatus,
	// the loaded round (book events in `state`); copied into stateBet.betToResume for every play
	round: null as null | Record<string, unknown>,
	costMultiplier: 1,
	payoutMultiplier: 0,
});
