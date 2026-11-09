// Source language. Keys are the English texts used in code (stateI18nDerived.translate('...')).
// Every other language file must provide every key (enforced by the GameMessages type).
const en = {
	// UI (components-ui-pixi)
	AUDIO: 'AUDIO',
	BALANCE: 'BALANCE',
	WIN: 'WIN',
	BET: 'BET',
	STOP: 'STOP',
	'BUY BONUS': 'BUY BONUS',
	DISABLE: 'DISABLE',
	'FREE SPINS': 'FREE SPINS',
	'-': '-',
	'+': '+',
	MENU: 'MENU',
	TURBO: 'TURBO',
	'AUTO SPIN': 'AUTO SPIN',
	PAYTABLE: 'PAYTABLE',
	INFO: 'INFO',
	SETTINGS: 'SETTINGS',
	'SOUND ON': 'SOUND ON',
	'SOUND OFF': 'SOUND OFF',
	EXIT: 'EXIT',

	// UI (components-ui-html)
	MAX: 'MAX',
	'BET MENU': 'BET MENU',
	'SELECT YOUR BET': 'SELECT YOUR BET',
	CONFIRM: 'CONFIRM',
	'MASTER VOLUME': 'MASTER VOLUME',
	'MUSIC VOLUME': 'MUSIC VOLUME',
	'SOUND EFFECT VOLUME': 'SOUND EFFECT VOLUME',
	'AUTO SPINS': 'AUTO SPINS',
	'NUMBER OF ROUNDS': 'NUMBER OF ROUNDS',
	ADVANCED: 'ADVANCED',
	'SINGLE WIN LIMIT': 'SINGLE WIN LIMIT',
	'LOSS LIMIT': 'LOSS LIMIT',
	'START AUTOPLAY': 'START AUTOPLAY',
	NOTIFICATION: 'NOTIFICATION',
	'AUTO PLAY HAS STOPPED DUE TO': 'AUTO PLAY HAS STOPPED DUE TO',
	'INSUFFICIENT FUNDS TO PLACE THIS BET. PLEASE ADD FUNDS TO YOUR ACCOUNT OR LOWER THE BET LEVEL.':
		'INSUFFICIENT FUNDS TO PLACE THIS BET. PLEASE ADD FUNDS TO YOUR ACCOUNT OR LOWER THE BET LEVEL.',
	'LOSS LIMIT REACHED': 'LOSS LIMIT REACHED',
	'SINGLE WIN LIMIT REACHED': 'SINGLE WIN LIMIT REACHED',

	// game
	'{current} OF {total}': '{current} OF {total}',
	'BIG WIN': 'BIG WIN',
	'SUPER WIN': 'SUPER WIN',
	'MEGA WIN': 'MEGA WIN',
	'EPIC WIN!': 'EPIC WIN!',
	'MAX WIN': 'MAX WIN',
	// bonus buy ("RUMBELLY'S ROUNDS" is the feature's name: same in every language)
	"RUMBELLY'S ROUNDS": "RUMBELLY'S ROUNDS",
	'BUY FREE SPINS FOR {price}?': 'BUY FREE SPINS FOR {price}?',

	// paytable
	'SYMBOL PAYOUTS': 'SYMBOL PAYOUTS',
	'Wins count from left to right on adjacent reels, starting from the leftmost reel.':
		'Wins count from left to right on adjacent reels, starting from the leftmost reel.',
	'Only the highest win on each line counts. Wins on different lines are added together.':
		'Only the highest win on each line counts. Wins on different lines are added together.',
	'Values are shown for the current total bet.': 'Values are shown for the current total bet.',
	'WILD substitutes for all symbols except SCATTER.': 'WILD substitutes for all symbols except SCATTER.',
	"SCATTER can land anywhere. 3, 4 or 5 SCATTER symbols start RUMBELLY'S ROUNDS.":
		"SCATTER can land anywhere. 3, 4 or 5 SCATTER symbols start RUMBELLY'S ROUNDS.",
	'WIN LINES': 'WIN LINES',
	'9 fixed win lines.': '9 fixed win lines.',

	// game rules
	'GAME RULES': 'GAME RULES',
	'3, 4 or 5 SCATTER symbols anywhere award 8, 10 or 12 free spins.':
		'3, 4 or 5 SCATTER symbols anywhere award 8, 10 or 12 free spins.',
	"During free spins, every MUG symbol that lands fills Rumbelly's mug meter.":
		"During free spins, every MUG symbol that lands fills Rumbelly's mug meter.",
	'Every 4 mugs raise the multiplier for all wins: x2, x3, x5 and x10 (16 mugs). Each new multiplier also awards 2 extra free spins and applies from the next spin.':
		'Every 4 mugs raise the multiplier for all wins: x2, x3, x5 and x10 (16 mugs). Each new multiplier also awards 2 extra free spins and applies from the next spin.',
	'3 or more SCATTER symbols during free spins award 5 extra free spins.':
		'3 or more SCATTER symbols during free spins award 5 extra free spins.',
	'BUY FREE SPINS': 'BUY FREE SPINS',
	"RUMBELLY'S ROUNDS can be bought for {cost}x the total bet ({price}). The round starts with 3 to 5 SCATTER symbols.":
		"RUMBELLY'S ROUNDS can be bought for {cost}x the total bet ({price}). The round starts with 3 to 5 SCATTER symbols.",
	'GAME INFORMATION': 'GAME INFORMATION',
	'Theoretical return to player (RTP): {base} in the base game, {bonus} for bought free spins.':
		'Theoretical return to player (RTP): {base} in the base game, {bonus} for bought free spins.',
	'Maximum win: {max}x the total bet in every mode. When it is reached, the round ends and any remaining free spins are lost.':
		'Maximum win: {max}x the total bet in every mode. When it is reached, the round ends and any remaining free spins are lost.',
	'Minimum bet: {min}. Maximum bet: {max}.': 'Minimum bet: {min}. Maximum bet: {max}.',
	'HOW TO PLAY': 'HOW TO PLAY',
	'Press the spin button or the spacebar to start a round.':
		'Press the spin button or the spacebar to start a round.',
	'Use + and − to change the bet.': 'Use + and − to change the bet.',
	'AUTO SPIN: choose the number of rounds and confirm to start. Press again to stop.':
		'AUTO SPIN: choose the number of rounds and confirm to start. Press again to stop.',
	'TURBO: faster spins.': 'TURBO: faster spins.',
	"BUY BONUS: start RUMBELLY'S ROUNDS right away. A confirmation is shown first.":
		"BUY BONUS: start RUMBELLY'S ROUNDS right away. A confirmation is shown first.",
	'MENU: paytable, game rules, settings and sound.': 'MENU: paytable, game rules, settings and sound.',
	'BALANCE shows your balance. WIN shows the win of the current round.':
		'BALANCE shows your balance. WIN shows the win of the current round.',
	DISCLAIMER: 'DISCLAIMER',
	// Engine "General disclaimer" template (approval requirement)
	DISCLAIMER_TEXT:
		'Malfunction voids all wins and plays. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted rounds. The expected return is calculated over many plays. The game display is not representative of any physical device and is for illustrative purposes only. Winnings are settled according to the amount received from the Remote Game Server and not from events within the web browser. TM and © 2026 Engine.',

	// bet replay
	PLAY: 'PLAY',
	'PLAY AGAIN': 'PLAY AGAIN',
	'REAL COST': 'REAL COST',
	'LOADING REPLAY…': 'LOADING REPLAY…',
	'REPLAY UNAVAILABLE': 'REPLAY UNAVAILABLE',
	BASE: 'BASE',
	BONUS: 'BONUS',
	// loading screen
	"Land 3 rum barrels to start RUMBELLY'S ROUNDS!": "Land 3 rum barrels to start RUMBELLY'S ROUNDS!",
	"3, 4 or 5 barrels give 8, 10 or 12 free spins!": "3, 4 or 5 barrels give 8, 10 or 12 free spins!",
	"Every 4 mugs raise the multiplier, up to x10!": "Every 4 mugs raise the multiplier, up to x10!",
	"Each new multiplier pours 2 more free spins!": "Each new multiplier pours 2 more free spins!",
	"3 or more barrels in the free spins? +5 spins on the house!": "3 or more barrels in the free spins? +5 spins on the house!",
	"Rumbelly's emblem is WILD: it replaces every symbol except the barrel!": "Rumbelly's emblem is WILD: it replaces every symbol except the barrel!",
	"Ahoy, matey! The taps are open.": "Ahoy, matey! The taps are open.",
	"Pull up a stool, this round's on Rumbelly!": "Pull up a stool, this round's on Rumbelly!",
	"Mind the foam, sailor!": "Mind the foam, sailor!",
	"Cheers! Another round for the reels!": "Cheers! Another round for the reels!",
	"PRESS ANYWHERE TO CONTINUE": "PRESS ANYWHERE TO CONTINUE",
};

export type MessageKey = keyof typeof en;
export type GameMessages = Record<MessageKey, string>;

export default en satisfies GameMessages;
