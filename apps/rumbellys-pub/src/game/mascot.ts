// Rumbelly's animations: frame clips (MJ Animate -> art/tools pipeline -> sprite sheets).
//
// How clips change without a jerk:
// - every clip starts and ends in the same pose as rumbelly.webp (MJ Animate starts from it,
//   `--loop` brings the last frame back to it);
// - idle is the calm pose (the static picture), so it can be left at any moment;
// - now and then idle plays a "fidget" (he turns to the viewer and laughs); an event that comes
//   during it waits for its end (~2 s) instead of cutting it in the middle of the move;
// - the switch is a short crossfade (Mascot.svelte);
// - an event clip does not restart itself and is not cut by a less important one (queue below).

export type MascotClip =
	| 'idle'
	| 'fidget'
	| 'win'
	| 'drink'
	| 'cheer'
	| 'fsTrigger'
	| 'bigWin';

export type MascotClipInfo = {
	prefix: string; // frame keys "<prefix>_00", "<prefix>_01", ...
	count: number; // 0: no frames yet, the static picture is shown and events are ignored
	fps: number;
	loop: boolean;
	priority: number; // a clip can cut a playing clip of a lower priority
	waitForEnd?: boolean; // never cut: other clips wait until it ends
	// the clip leaves the sprite's picture (a mug lifted above the head): its frames are bigger by
	// these margins, as parts of the sprite's height (mascot_anim.py prints them)
	margin?: MascotMargin;
};

export type MascotMargin = { left: number; top: number; right: number; bottom: number };

export const MASCOT_ASPECT = 574 / 768; // rumbelly.webp

// Where Rumbelly stands, in symbols: x / y are his feet (anchor bottom centre) from the board's
// right / bottom edge, height is the static picture's height. He faces left.
export type MascotPlacement = { height: number; x: number; y: number };
export const MASCOT_PLACEMENT: Record<'normal' | 'portrait', MascotPlacement> = {
	normal: { height: 3.6, x: 2.07, y: 1.37 }, // right of the reels
	portrait: { height: 2.25, x: -0.95, y: 2.85 }, // in the pub scene under the reels, right side
};

// The bright spot the popups' dark veil leaves around him (free spins popups, big win), in board
// units (`size` = one symbol). Inside `clear` the veil is gone, it grows back up to `outer`.
// The ellipse also takes in a mug lifted above his head (cheer).
export const mascotSpot = (
	placement: MascotPlacement,
	size: number,
	board: { width: number; height: number },
) => {
	const height = placement.height * size;
	return {
		x: board.width + placement.x * size,
		y: board.height + placement.y * size - height * 0.6,
		clear: { x: height * 0.45, y: height * 0.62 },
		outer: { x: height * 0.62, y: height * 0.8 },
	};
};

// Size and anchor of a frame, so the sprite's area inside it lies exactly where the static picture
// is (feet at the anchor, the same scale). `height` is the static picture's height.
export const mascotFrameGeometry = (height: number, margin?: MascotMargin) => {
	const m = margin ?? { left: 0, top: 0, right: 0, bottom: 0 };
	const width = MASCOT_ASPECT + m.left + m.right;
	const full = 1 + m.top + m.bottom;
	return {
		width: height * width,
		height: height * full,
		anchor: { x: (m.left + MASCOT_ASPECT / 2) / width, y: (m.top + 1) / full },
	};
};

// frames: art/tools/mascot_anim.py (sheets <prefix>1, <prefix>2, ... in assets.ts)
export const MASCOT_CLIPS: Record<MascotClip, MascotClipInfo> = {
	idle: { prefix: 'mascotIdle', count: 0, fps: 12, loop: true, priority: 0 },
	// art/rumbelly_idle.mp4 frames 18-72, every 2nd
	fidget: { prefix: 'mascotFidget', count: 28, fps: 12, loop: false, priority: 0, waitForEnd: true },
	// a medium win (not small: those come every spin or two; big wins have their own clip);
	// art/rumbelly_win.mp4 frames 12-34 every 2nd, then 18-12 backwards (MJ took 2 more seconds
	// to lower the hand): a thumbs up with a grin, the hand goes straight back down
	win: {
		prefix: 'mascotWin',
		count: 16,
		fps: 12,
		loop: false,
		priority: 1,
		margin: { left: 0.0078, top: 0, right: 0.0065, bottom: 0 },
	},
	// a mug lands; art/rumbelly_drink.mp4 frames 12-48 every 2nd: the gulp ends with the mug
	// almost back in place (later the clip lowers it elsewhere and MJ drew foam drops)
	drink: {
		prefix: 'mascotDrink',
		count: 19,
		fps: 12,
		loop: false,
		priority: 1,
		margin: { left: 0.013, top: 0.1133, right: 0.0352, bottom: 0 },
	},
	// new multiplier, FS end; art/rumbelly_cheer.mp4 frames 14-76 every 2nd: a toast with the mug
	// high above his head, laughing, back to the start pose
	cheer: {
		prefix: 'mascotCheer',
		count: 32,
		fps: 12,
		loop: false,
		priority: 2,
		margin: { left: 0.013, top: 0.2005, right: 0.0703, bottom: 0 },
	},
	// 3+ barrels (free spins intro); art/rumbelly_fs_trigger.mp4 frames 13-95 every 2nd: "Oho!",
	// he waves the viewer in with his free hand, laughs, back to the start pose
	fsTrigger: {
		prefix: 'mascotFsTrigger',
		count: 42,
		fps: 12,
		loop: false,
		priority: 3,
		margin: { left: 0.0521, top: 0.0078, right: 0.0846, bottom: 0 },
	},
	bigWin: { prefix: 'mascotBigWin', count: 0, fps: 12, loop: false, priority: 4 },
};

export const MASCOT_CROSSFADE_MS = 150;
// idle plays the fidget after a random pause in this range
export const MASCOT_FIDGET_PAUSE_MS = { min: 8000, max: 12000 };

export const hasFrames = (clip: MascotClip, clips = MASCOT_CLIPS) => clips[clip].count > 0;

export const mascotFrameKey = (clip: MascotClip, frame: number, clips = MASCOT_CLIPS) =>
	`${clips[clip].prefix}_${String(frame).padStart(2, '0')}`;

// Which clip plays now and which one waits. Only one clip waits: the most important one.
export const createMascotQueue = (clips = MASCOT_CLIPS) => {
	let current: MascotClip = 'idle';
	let pending: MascotClip | null = null;

	return {
		current: () => current,
		pending: () => pending,
		// an event wants a clip; returns the clip to switch to now, or null (it waits or is dropped)
		request(clip: MascotClip): MascotClip | null {
			if (clip === 'idle' || !hasFrames(clip, clips)) return null;
			// the fidget only starts from idle, it never waits
			if (clip === 'fidget') {
				if (current !== 'idle') return null;
				current = clip;
				return clip;
			}
			const canCut = !clips[current].waitForEnd && clips[clip].priority > clips[current].priority;
			if (current === 'idle' || canCut) {
				current = clip;
				if (pending && clips[pending].priority <= clips[clip].priority) pending = null;
				return clip;
			}
			// the same clip is playing: no restart (5 mugs in one spin = one drink)
			if (clip === current) return null;
			if (pending === null || clips[clip].priority > clips[pending].priority) pending = clip;
			return null;
		},
		// the playing clip has ended; returns the next one (the waiting clip or idle)
		finish(): MascotClip {
			current = pending ?? 'idle';
			pending = null;
			return current;
		},
	};
};
