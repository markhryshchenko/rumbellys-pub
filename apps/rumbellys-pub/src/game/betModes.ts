import type { BetModeData, BetModeMeta } from 'state-shared';

import config from './config';

// Rumbelly's Pub has two modes (names match the math, case-insensitive on the RGS):
// BASE - a normal spin; BONUS - buys "Rumbelly's Rounds" free spins.
// Texts are message ids (see src/i18n/messages), translated where they are shown.
const NO_ASSETS: BetModeData['assets'] = {
	icon: '',
	volatility: '',
	button: '',
	dialogImage: '',
	dialogVolatility: '',
};

export const BET_MODE_META: BetModeMeta = {
	BASE: {
		mode: 'BASE',
		costMultiplier: config.betModes.base.cost,
		maxWin: config.betModes.base.max_win,
		type: 'default',
		parent: '',
		children: '',
		assets: NO_ASSETS,
		text: { title: '', dialog: '', button: '', tickerIdle: '', tickerSpin: '' },
	},
	BONUS: {
		mode: 'BONUS',
		costMultiplier: config.betModes.bonus.cost,
		maxWin: config.betModes.bonus.max_win,
		type: 'buy',
		parent: '',
		children: '',
		assets: NO_ASSETS,
		text: {
			title: "RUMBELLY'S ROUNDS",
			dialog: 'BUY FREE SPINS FOR {price}?',
			button: 'BUY BONUS',
			tickerIdle: '',
			tickerSpin: '',
		},
	},
};
