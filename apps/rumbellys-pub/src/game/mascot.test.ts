import { describe, expect, it } from 'vitest';

import {
	createMascotQueue,
	mascotFrameGeometry,
	mascotFrameKey,
	MASCOT_ASPECT,
	MASCOT_CLIPS,
	type MascotClip,
} from './mascot';

// every clip with frames, so the queue logic can be tested before the art exists
const clips = Object.fromEntries(
	Object.entries(MASCOT_CLIPS).map(([name, info]) => [name, { ...info, count: 10 }]),
) as typeof MASCOT_CLIPS;

describe('mascot queue', () => {
	it('leaves idle at once for any event clip', () => {
		const queue = createMascotQueue(clips);
		expect(queue.request('drink')).toBe('drink');
		expect(queue.current()).toBe('drink');
	});

	it('does not restart the clip that is playing', () => {
		const queue = createMascotQueue(clips);
		queue.request('drink');
		expect(queue.request('drink')).toBeNull();
		expect(queue.pending()).toBeNull();
	});

	it('lets a more important clip cut a less important one', () => {
		const queue = createMascotQueue(clips);
		queue.request('drink');
		expect(queue.request('bigWin')).toBe('bigWin');
		expect(queue.finish()).toBe('idle'); // the cut drink is not replayed
	});

	it('keeps a less important clip waiting, then plays it', () => {
		const queue = createMascotQueue(clips);
		queue.request('bigWin');
		expect(queue.request('cheer')).toBeNull();
		expect(queue.pending()).toBe('cheer');
		expect(queue.finish()).toBe('cheer');
		expect(queue.finish()).toBe('idle');
	});

	it('keeps only the most important waiting clip', () => {
		const queue = createMascotQueue(clips);
		queue.request('bigWin');
		queue.request('drink');
		queue.request('cheer');
		queue.request('drink');
		expect(queue.pending()).toBe('cheer');
	});

	it('starts the fidget only from idle', () => {
		const queue = createMascotQueue(clips);
		expect(queue.request('fidget')).toBe('fidget');
		queue.finish();
		queue.request('drink');
		expect(queue.request('fidget')).toBeNull();
		expect(queue.pending()).toBeNull(); // a missed fidget is not kept
	});

	it('lets an event wait for the end of the fidget', () => {
		const queue = createMascotQueue(clips);
		queue.request('fidget');
		expect(queue.request('bigWin')).toBeNull();
		expect(queue.current()).toBe('fidget');
		expect(queue.finish()).toBe('bigWin');
	});

	it('ignores clips without frames', () => {
		const queue = createMascotQueue(); // the real clips: these have no art yet (count 0)
		const all: MascotClip[] = ['cheer', 'fsTrigger', 'bigWin'];
		for (const clip of all) expect(queue.request(clip)).toBeNull();
		expect(queue.current()).toBe('idle');
	});

	it('places a frame with margins over the static picture', () => {
		const plain = mascotFrameGeometry(100);
		expect(plain.anchor).toEqual({ x: 0.5, y: 1 });
		expect(plain.width).toBeCloseTo(100 * MASCOT_ASPECT);

		const margin = { left: 0.1, top: 0.2, right: 0.05, bottom: 0 };
		const big = mascotFrameGeometry(100, margin);
		expect(big.height).toBeCloseTo(120);
		// the static picture's feet (bottom centre) stay at the anchor
		expect(big.anchor.x * big.width).toBeCloseTo(10 + (100 * MASCOT_ASPECT) / 2);
		expect(big.anchor.y * big.height).toBeCloseTo(20 + 100);
	});

	it('builds frame keys like the sprite sheets', () => {
		expect(mascotFrameKey('drink', 3)).toBe('mascotDrink_03');
	});
});
