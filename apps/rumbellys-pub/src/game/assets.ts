// Assets the game loads. Only our own art: Engine does not approve web-sdk sample assets.
export default {
	loaderRumbelly1: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/loaderRumbelly1/loaderRumbelly1.json', import.meta.url).href,
		preload: true,
	},
	loaderRumbelly2: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/loaderRumbelly2/loaderRumbelly2.json', import.meta.url).href,
		preload: true,
	},
	loaderSign: {
		type: 'sprite',
		src: new URL('../../assets/sprites/loader/sign.webp', import.meta.url).href,
		preload: true,
	},
	loaderBar: {
		type: 'sprite',
		src: new URL('../../assets/sprites/loader/bar.webp', import.meta.url).href,
		preload: true,
	},
	loaderBubble: {
		type: 'sprite',
		src: new URL('../../assets/sprites/loader/bubble.webp', import.meta.url).href,
		preload: true,
	},
	reelFrame: {
		type: 'sprite',
		src: new URL('../../assets/sprites/reelsFrame/reel_frame.webp', import.meta.url).href,
	},
	reelFramePortrait: {
		type: 'sprite',
		src: new URL('../../assets/sprites/reelsFrame/reel_frame_portrait.webp', import.meta.url).href,
	},
	reelBackground: {
		type: 'sprite',
		src: new URL('../../assets/sprites/reelsFrame/reel_bg.webp', import.meta.url).href,
	},
	buyBonusBanner: {
		type: 'sprite',
		src: new URL('../../assets/sprites/buyBonus/banner.webp', import.meta.url).href,
	},
	parrot: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/parrot/parrot.json', import.meta.url).href,
	},
	uiIcons: {
		type: 'sprites',
		src: new URL('../../assets/sprites/uiIcons/uiIcons.json', import.meta.url).href,
	},
	rumbelly: {
		type: 'sprite',
		src: new URL('../../assets/sprites/rumbelly/rumbelly.webp', import.meta.url).href,
	},
	// Rumbelly clips (art/tools/mascot_anim.py): frames "<clip>_00".. across the sheets
	mascotFidget1: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFidget1/mascotFidget1.json', import.meta.url).href,
	},
	mascotFidget2: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFidget2/mascotFidget2.json', import.meta.url).href,
	},
	mascotFidget3: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFidget3/mascotFidget3.json', import.meta.url).href,
	},
	mascotWin1: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotWin1/mascotWin1.json', import.meta.url).href,
	},
	mascotWin2: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotWin2/mascotWin2.json', import.meta.url).href,
	},
	mascotDrink1: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotDrink1/mascotDrink1.json', import.meta.url).href,
	},
	mascotDrink2: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotDrink2/mascotDrink2.json', import.meta.url).href,
	},
	mascotCheer1: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotCheer1/mascotCheer1.json', import.meta.url).href,
	},
	mascotCheer2: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotCheer2/mascotCheer2.json', import.meta.url).href,
	},
	mascotCheer3: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotCheer3/mascotCheer3.json', import.meta.url).href,
	},
	mascotFsTrigger1: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFsTrigger1/mascotFsTrigger1.json', import.meta.url).href,
	},
	mascotFsTrigger2: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFsTrigger2/mascotFsTrigger2.json', import.meta.url).href,
	},
	mascotFsTrigger3: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFsTrigger3/mascotFsTrigger3.json', import.meta.url).href,
	},
	mascotFsTrigger4: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mascotFsTrigger4/mascotFsTrigger4.json', import.meta.url).href,
	},
	// game title font (sign, big win). Pixi registers it as the "New Rocker" family (from the
	// file name). Latin only: other scripts fall back to GAME_FONT_FAMILY. License: OFL.txt next to it.
	newRocker: {
		type: 'font',
		src: new URL('../../assets/fonts/newRocker/new-rocker.woff2', import.meta.url).href,
	},
	backgroundLandscape: {
		type: 'sprite',
		src: new URL('../../assets/sprites/background/bg_landscape.webp', import.meta.url).href,
		preload: true,
	},
	backgroundPortrait: {
		type: 'sprite',
		src: new URL('../../assets/sprites/background/bg_portrait.webp', import.meta.url).href,
		preload: true,
	},
	lanternGlow: {
		type: 'sprite',
		src: new URL('../../assets/sprites/background/glow.webp', import.meta.url).href,
		preload: true,
	},
	symbolsStatic: {
		type: 'sprites',
		src: new URL('../../assets/sprites/symbolsStatic/symbolsStatic.json', import.meta.url).href,
	},
	// symbol win animations (art/tools/symbol_anim.py, from Midjourney Animate clips)
	coinWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/coinWin/coinWin.json', import.meta.url).href,
	},
	wildWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/wildWin/wildWin.json', import.meta.url).href,
	},
	mugWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/mugWin/mugWin.json', import.meta.url).href,
	},
	hatWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/hatWin/hatWin.json', import.meta.url).href,
	},
	sabresWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/sabresWin/sabresWin.json', import.meta.url).href,
	},
	rumWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/rumWin/rumWin.json', import.meta.url).href,
	},
	fishWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/fishWin/fishWin.json', import.meta.url).href,
	},
	scatterWin: {
		type: 'sprites',
		src: new URL('../../assets/sprites/scatterWin/scatterWin.json', import.meta.url).href,
	},
	// wooden sign behind the big win title (art/tools/bigwin_sign.py)
	bigWinSign: {
		type: 'sprite',
		src: new URL('../../assets/sprites/bigWin/sign.webp', import.meta.url).href,
	},
	// big win coin fountain: our doubloon turned from front to edge (art/tools/coin_frames.py)
	rumbellyCoins: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/rumbellyCoins/coins.json', import.meta.url).href,
	},
	sound: {
		type: 'audio',
		src: new URL('../../assets/audio/sounds.json', import.meta.url).href,
		preload: true,
	},
} as const;
