import { stateI18nDerived } from 'state-shared';

import { i18nDerived as i18nDerivedUiPixi } from 'components-ui-pixi';
import { i18nDerived as i18nDerivedUiHtml } from 'components-ui-html';

// loading screen speech bubble: rules hints and tavern talk, no promises of a win
const LOADER_TIPS = [
	"Land 3 rum barrels to start RUMBELLY'S ROUNDS!",
	"3, 4 or 5 barrels give 8, 10 or 12 free spins!",
	"Every 4 mugs raise the multiplier, up to x10!",
	"Each new multiplier pours 2 more free spins!",
	"3 or more barrels in the free spins? +5 spins on the house!",
	"Rumbelly's emblem is WILD: it replaces every symbol except the barrel!",
	"Ahoy, matey! The taps are open.",
	"Pull up a stool, this round's on Rumbelly!",
	"Mind the foam, sailor!",
	"Cheers! Another round for the reels!",
];

export const i18nDerived = {
	...i18nDerivedUiPixi,
	...i18nDerivedUiHtml,
	freeSpinOf: (current: number, total: number) =>
		stateI18nDerived.translate('{current} OF {total}', { current, total }),
	loaderTips: () => LOADER_TIPS.map((tip) => stateI18nDerived.translate(tip)),
	pressToContinue: () => stateI18nDerived.translate('PRESS ANYWHERE TO CONTINUE'),
	// bet replay
	replayPlay: () => stateI18nDerived.translate('PLAY'),
	replayPlayAgain: () => stateI18nDerived.translate('PLAY AGAIN'),
	replayRealCost: () => stateI18nDerived.translate('REAL COST'),
	replayLoading: () => stateI18nDerived.translate('LOADING REPLAY…'),
	replayUnavailable: () => stateI18nDerived.translate('REPLAY UNAVAILABLE'),
	betModeName: (mode: string) =>
		stateI18nDerived.translate(mode.toLowerCase() === 'bonus' ? 'BONUS' : 'BASE'),
};
