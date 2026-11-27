<script lang="ts" module>
	import type { MascotClip } from '../game/mascot';

	export type EmitterEventMascot = { type: 'mascotPlay'; clip: MascotClip };
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { Container, Sprite } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import {
		createMascotQueue,
		hasFrames,
		mascotFrameKey,
		MASCOT_CLIPS,
		MASCOT_PLACEMENT,
		MASCOT_CROSSFADE_MS,
		MASCOT_FIDGET_PAUSE_MS,
		mascotFrameGeometry,
	} from '../game/mascot';

	// Rumbelly faces left, feet on the floor in front of the bar (MASCOT_PLACEMENT).
	// Clips, queue, frame size and the no-jerk rules: game/mascot.ts. A clip without frames shows
	// rumbelly.webp.
	const context = getContext();
	const placement = $derived(
		MASCOT_PLACEMENT[context.stateLayoutDerived.layoutType() === 'portrait' ? 'portrait' : 'normal'],
	);
	const pictureHeight = $derived(placement.height * SYMBOL_SIZE);

	const queue = createMascotQueue();
	let clip = $state<MascotClip>('idle');
	let frame = $state(0);
	let clipTime = 0; // ms since the clip started

	// crossfade: the last frame of the old clip fades out over the new one
	let fadeKey = $state<string | null>(null);
	let fadeClip = $state<MascotClip>('idle');
	let fadeAlpha = $state(0);

	const keyOf = (name: MascotClip, index: number) =>
		hasFrames(name) ? mascotFrameKey(name, index) : 'rumbelly';
	const currentKey = $derived(keyOf(clip, frame));
	// frames of a clip with margins are bigger than the static picture, placed over it
	const geometryOf = (name: MascotClip) =>
		mascotFrameGeometry(pictureHeight, hasFrames(name) ? MASCOT_CLIPS[name].margin : undefined);

	const switchTo = (next: MascotClip) => {
		fadeKey = currentKey;
		fadeClip = clip;
		fadeAlpha = 1;
		clip = next;
		frame = 0;
		clipTime = 0;
		idleTime = 0;
	};

	// idle: the fidget comes after a random pause, so it does not look mechanical
	const fidgetPause = () =>
		MASCOT_FIDGET_PAUSE_MS.min +
		Math.random() * (MASCOT_FIDGET_PAUSE_MS.max - MASCOT_FIDGET_PAUSE_MS.min);
	let nextFidget = fidgetPause();
	let idleTime = 0; // ms in idle since the last clip (idle frames may loop, clipTime restarts)

	const step = (dt: number) => {
		if (fadeAlpha > 0) fadeAlpha = Math.max(0, fadeAlpha - dt / MASCOT_CROSSFADE_MS);
		const info = MASCOT_CLIPS[clip];
		clipTime += dt;

		if (clip === 'idle') idleTime += dt;
		if (clip === 'idle' && idleTime >= nextFidget) {
			nextFidget = fidgetPause();
			const next = queue.request('fidget');
			if (next) switchTo(next);
			return;
		}
		if (!hasFrames(clip)) return; // static picture

		const index = Math.floor((clipTime / 1000) * info.fps);
		if (index < info.count) {
			frame = index;
		} else if (info.loop) {
			clipTime %= (info.count / info.fps) * 1000;
			frame = Math.floor((clipTime / 1000) * info.fps) % info.count;
		} else {
			switchTo(queue.finish());
		}
	};

	let frameId = 0;
	onMount(() => {
		let last = 0;
		const tick = (now: number) => {
			if (last) step((now - last) * stateBetDerived.timeScale());
			last = now;
			frameId = requestAnimationFrame(tick);
		};
		frameId = requestAnimationFrame(tick);
	});
	onDestroy(() => cancelAnimationFrame(frameId));

	context.eventEmitter.subscribeOnMount({
		mascotPlay: (emitterEvent) => {
			const next = queue.request(emitterEvent.clip);
			if (next) switchTo(next);
		},
	});

	const current = $derived(geometryOf(clip));
	const fading = $derived(fadeKey ? geometryOf(fadeClip) : current);
</script>

<BoardContainer>
	<Container
		x={context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * placement.x}
		y={context.stateGameDerived.boardLayout().height + SYMBOL_SIZE * placement.y}
	>
		<Sprite key={currentKey} {...current} />
		<!-- always mounted, so it always stays above the current frame -->
		<Sprite
			key={fadeKey ?? currentKey}
			alpha={fadeAlpha}
			visible={fadeAlpha > 0}
			{...fading}
		/>
	</Container>
</BoardContainer>
