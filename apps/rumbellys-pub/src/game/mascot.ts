// Rumbelly's animations: frame clips (MJ Animate -> art/tools pipeline -> sprite sheets).
//
// How clips change without a jerk:
// - every clip starts and ends in the same pose as rumbelly.webp (MJ Animate starts from it,
//   `--loop` brings the last frame back to it);
// - idle moves only a little (breathing, blinking), so any idle frame is close to that pose
//   and idle can be left at any moment;
// - the switch is a short crossfade (Mascot.svelte);
// - an event clip does not restart itself and is not cut by a less important one (queue below).

export type MascotClip = 'idle' | 'drink' | 'cheer' | 'fsTrigger' | 'bigWin';

export type MascotClipInfo = {
	prefix: string; // frame keys "<prefix>_00", "<prefix>_01", ...
	count: number; // 0: no frames yet, the static picture is shown and events are ignored
	fps: number;
	loop: boolean;
	priority: number; // a clip can cut a playing clip of a lower priority
};

export const MASCOT_CLIPS: Record<MascotClip, MascotClipInfo> = {
	idle: { prefix: 'mascotIdle', count: 0, fps: 9.6, loop: true, priority: 0 },
	drink: { prefix: 'mascotDrink', count: 0, fps: 9.6, loop: false, priority: 1 }, // a mug lands
	cheer: { prefix: 'mascotCheer', count: 0, fps: 9.6, loop: false, priority: 2 }, // new multiplier, FS end
	fsTrigger: { prefix: 'mascotFsTrigger', count: 0, fps: 9.6, loop: false, priority: 3 }, // 3+ barrels
	bigWin: { prefix: 'mascotBigWin', count: 0, fps: 9.6, loop: false, priority: 4 },
};

export const MASCOT_CROSSFADE_MS = 150;

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
			if (current === 'idle' || clips[clip].priority > clips[current].priority) {
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
