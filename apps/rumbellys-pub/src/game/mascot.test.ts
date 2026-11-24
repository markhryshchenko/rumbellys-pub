import { describe, expect, it } from 'vitest';

import { createMascotQueue, mascotFrameKey, MASCOT_CLIPS, type MascotClip } from './mascot';

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

	it('ignores clips without frames', () => {
		const queue = createMascotQueue(); // no art yet: every count is 0
		const all: MascotClip[] = ['drink', 'cheer', 'fsTrigger', 'bigWin'];
		for (const clip of all) expect(queue.request(clip)).toBeNull();
		expect(queue.current()).toBe('idle');
	});

	it('builds frame keys like the sprite sheets', () => {
		expect(mascotFrameKey('drink', 3)).toBe('mascotDrink_03');
	});
});
