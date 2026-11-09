import type { GameMessages } from './en';

// Social casino (stake.us, ?social=true): English only, restricted gambling terms replaced
// following the Engine "Jurisdiction requirements" table. Keys not listed here use `en`.
const sweepsEn: Partial<GameMessages> = {
	BET: 'PLAY',
	'BUY BONUS': 'GET BONUS',
	PAYTABLE: 'WIN TABLE',
	'BET MENU': 'PLAY MENU',
	'SELECT YOUR BET': 'SELECT YOUR PLAY AMOUNT',
	'BUY FREE SPINS FOR {price}?': 'GET FREE SPINS FOR {price}?',
	// info screens
	'SYMBOL PAYOUTS': 'SYMBOL WINS',
	'Values are shown for the current total bet.': 'Values are shown for the current total play.',
	'BUY FREE SPINS': 'GET FREE SPINS',
	"RUMBELLY'S ROUNDS can be bought for {cost}x the total bet ({price}). The round starts with 3 to 5 SCATTER symbols.":
		"RUMBELLY'S ROUNDS can be played for {cost}x the total play ({price}). The round starts with 3 to 5 SCATTER symbols.",
	'Theoretical return to player (RTP): {base} in the base game, {bonus} for bought free spins.':
		'Theoretical return to player (RTP): {base} in the base game, {bonus} for free spins started with GET BONUS.',
	'Maximum win: {max}x the total bet in every mode. When it is reached, the round ends and any remaining free spins are lost.':
		'Maximum win: {max}x the total play in every mode. When it is reached, the round ends and any remaining free spins are lost.',
	'Minimum bet: {min}. Maximum bet: {max}.': 'Minimum play: {min}. Maximum play: {max}.',
	'Use + and − to change the bet.': 'Use + and − to change the play amount.',
	"BUY BONUS: start RUMBELLY'S ROUNDS right away. A confirmation is shown first.":
		"GET BONUS: start RUMBELLY'S ROUNDS right away. A confirmation is shown first.",
	'MENU: paytable, game rules, settings and sound.': 'MENU: win table, game rules, settings and sound.',
	'INSUFFICIENT FUNDS TO PLACE THIS BET. PLEASE ADD FUNDS TO YOUR ACCOUNT OR LOWER THE BET LEVEL.':
		'INSUFFICIENT BALANCE FOR THIS PLAY. PLEASE GET COINS OR LOWER THE PLAY AMOUNT.',
};

export default sweepsEn;
