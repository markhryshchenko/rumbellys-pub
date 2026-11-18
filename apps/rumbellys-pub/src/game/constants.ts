import _ from 'lodash';
import { UI_FONT_FAMILY } from 'constants-shared/font';

import type { RawSymbol, SymbolState } from './types';

export const SYMBOL_SIZE = 120;

// Translated texts use Pixi `Text` with system fonts: they cover every script the RGS can
// request (Latin, Cyrillic, CJK, Arabic, Devanagari) and need no downloads (Engine forbids
// external requests). Same list as the shared UI (buttons, balance, popups).
export const GAME_FONT_FAMILY = UI_FONT_FAMILY;
export const GAME_TEXT_GOLD = { fill: 0xffd36b, stroke: { color: 0x2a160a, width: 6 } };
// Title font of the game sign (bundled web font, Latin scripts only). Missing glyphs (Cyrillic,
// CJK, Arabic, Devanagari, Vietnamese) are drawn by the next families in the list.
export const TITLE_FONT_FAMILY = ['New Rocker', ...GAME_FONT_FAMILY];
export const TITLE_GOLD = 0xffd36b;
export const TITLE_CREAM = 0xfff1d6;

// big win and free spins screens: sign font, dark outline and shadow
export const titleTextStyle = (fontSize: number, fill: number = TITLE_GOLD) => ({
	fontFamily: TITLE_FONT_FAMILY,
	fontSize,
	fill,
	stroke: { color: 0x2a160a, width: fontSize * 0.12, join: 'round' as const },
	dropShadow: {
		color: 0x000000,
		alpha: 0.6,
		blur: 6,
		distance: fontSize * 0.06,
		angle: Math.PI / 2,
	},
	align: 'center' as const,
});

export const REEL_PADDING = 0.53;

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [
	[
		{
			name: 'L2',
		},
		{
			name: 'L1',
		},
		{
			name: 'L4',
		},
		{
			name: 'H2',
		},
		{
			name: 'L1',
		},
	],
	[
		{
			name: 'H1',
		},
		{
			name: 'L5',
		},
		{
			name: 'L2',
		},
		{
			name: 'H3',
		},
		{
			name: 'L4',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'L5',
		},
		{
			name: 'L3',
		},
		{
			name: 'H4',
		},
		{
			name: 'L4',
		},
	],
	[
		{
			name: 'H4',
		},
		{
			name: 'H3',
		},
		{
			name: 'L4',
		},
		{
			name: 'L5',
		},
		{
			name: 'L1',
		},
	],
	[
		{
			name: 'H3',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'H1',
		},
		{
			name: 'H1',
		},
	],
];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

export const BOARD_SIZES = {
	width: SYMBOL_SIZE * BOARD_DIMENSIONS.x,
	height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
};

// wooden reel frame built by art/tools/build_scene.py (9-slice); its opening = board + 4%.
// Sizes in game units = image size / 2. Portrait gets a thinner frame (reels fill the width).
export const REEL_FRAME = {
	normal: { key: 'reelFrame', width: 765.5, height: 466 },
	portrait: { key: 'reelFramePortrait', width: 676.5, height: 408 },
};
// planks behind the reels a little bigger than the board, so the frame covers their edges
export const REEL_BACKGROUND_OVERLAP = 1.06;

// Free spins side panel (desktop / landscape), board coordinates (0,0 = top left of the reels):
// the free spin counter at the top, the mug meter under it, one dark backing behind both.
export const FREE_SPIN_PANEL = {
	x: -SYMBOL_SIZE * 2.75,
	y: -SYMBOL_SIZE * 0.3,
	width: SYMBOL_SIZE * 2.15,
	counterHeight: SYMBOL_SIZE * 0.85, // "FREE SPINS" + "1 OF 10"
	padding: SYMBOL_SIZE * 0.12,
};
// panel / strip backing behind the free spins counter and the mug meter
export const FREE_SPIN_PANEL_STYLE = {
	backgroundColor: 0x0d0603,
	backgroundAlpha: 0.9,
	borderColor: 0xc8902e,
	borderWidth: 3,
	borderRadius: SYMBOL_SIZE * 0.14,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'H5'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';

const HIGH_SYMBOL_SIZE = 0.9;
const LOW_SYMBOL_SIZE = 0.9;
const SPECIAL_SYMBOL_SIZE = 1;

const SPIN_OPTIONS_SHARED = {
	reelBounceBackSpeed: 0.15,
	reelSpinSpeedBeforeBounce: 4,
	reelPaddingMultiplierNormal: 1.2,
	reelPaddingMultiplierAnticipated: 10,
	reelSpinDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 2,
	reelSpinSpeed: 3,
	reelBounceSizeMulti: 0.3,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 5,
	reelSpinSpeed: 5,
	reelBounceSizeMulti: 0.05,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

// Rumbelly's Pub symbols come from the symbolsStatic atlas (built by art/tools/build_atlas.py).
// Every state shows the static sprite; symbols with winFrames play them on a win.
type SizeRatios = { width: number; height: number };
// win animation frames "<prefix>_00".. (art/tools/symbol_anim.py); a frame is cellScale x the symbol
// size, frame 0 covers the static symbol
export type WinFrames = { prefix: string; count: number; cellScale: number };
export type SpriteSymbolInfo = {
	type: 'sprite';
	assetKey: string;
	sizeRatios: SizeRatios;
	winFrames?: WinFrames;
};
export type SpineSymbolInfo = {
	type: 'spine';
	assetKey: string;
	animationName: string;
	sizeRatios: SizeRatios;
};
export type SymbolInfo = SpriteSymbolInfo | SpineSymbolInfo;

const sprite = (assetKey: string, size = 1): SymbolInfo => ({
	type: 'sprite',
	assetKey,
	sizeRatios: { width: size, height: size },
});

const allStates = (info: SymbolInfo) => ({
	explosion: info,
	win: info,
	postWinStatic: info,
	static: info,
	spin: info,
	land: info,
});

// static sprite in every state, the win state also plays its frames
const withWinFrames = (info: SymbolInfo, winFrames: WinFrames) => ({
	...allStates(info),
	win: { ...info, winFrames },
});

export const SYMBOL_INFO_MAP = {
	H1: withWinFrames(sprite('h1.webp', HIGH_SYMBOL_SIZE), {
		prefix: 'coinWin',
		count: 15,
		cellScale: 1.2,
	}),
	H2: allStates(sprite('h2.webp', HIGH_SYMBOL_SIZE)),
	H3: allStates(sprite('h3.webp', HIGH_SYMBOL_SIZE)),
	H4: allStates(sprite('h4.webp', HIGH_SYMBOL_SIZE)),
	H5: withWinFrames(sprite('h5.webp', HIGH_SYMBOL_SIZE), {
		prefix: 'mugWin',
		count: 10,
		cellScale: 1.2,
	}),
	L1: allStates(sprite('l1.webp', LOW_SYMBOL_SIZE)),
	L2: allStates(sprite('l2.webp', LOW_SYMBOL_SIZE)),
	L3: allStates(sprite('l3.webp', LOW_SYMBOL_SIZE)),
	L4: allStates(sprite('l4.webp', LOW_SYMBOL_SIZE)),
	L5: allStates(sprite('l5.webp', LOW_SYMBOL_SIZE)),
	W: withWinFrames(sprite('w.png', SPECIAL_SYMBOL_SIZE), {
		prefix: 'wildWin',
		count: 15,
		cellScale: 1.2,
	}),
	S: allStates(sprite('s.png', SPECIAL_SYMBOL_SIZE)),
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
