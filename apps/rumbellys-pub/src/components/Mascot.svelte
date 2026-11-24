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
		MASCOT_CROSSFADE_MS,
	} from '../game/mascot';

	// Rumbelly faces left, feet on the floor in front of the bar.
	// Clips, queue and the no-jerk rules: game/mascot.ts. A clip without frames shows rumbelly.webp.
	const ASPECT = 574 / 768; // rumbelly.webp; clip frames have the same size
	// x / y: his feet (anchor bottom centre), in symbols from the board's right / bottom edge
	const PLACEMENT = {
		// right of the reels
		normal: { height: SYMBOL_SIZE * 3.6, x: 2.07, y: 1.37 },
		// in the pub scene under the reels, right side
		portrait: { height: SYMBOL_SIZE * 2.25, x: -0.95, y: 2.85 },
	};

	const context = getContext();
	const placement = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait' ? PLACEMENT.portrait : PLACEMENT.normal,
	);

	const queue = createMascotQueue();
	let clip = $state<MascotClip>('idle');
	let frame = $state(0);
	let clipTime = 0; // ms since the clip started

	// crossfade: the last frame of the old clip fades out over the new one
	let fadeKey = $state<string | null>(null);
	let fadeAlpha = $state(0);

	const keyOf = (name: MascotClip, index: number) =>
		hasFrames(name) ? mascotFrameKey(name, index) : 'rumbelly';
	const currentKey = $derived(keyOf(clip, frame));

	const switchTo = (next: MascotClip) => {
		fadeKey = currentKey;
		fadeAlpha = 1;
		clip = next;
		frame = 0;
		clipTime = 0;
	};

	const step = (dt: number) => {
		if (fadeAlpha > 0) fadeAlpha = Math.max(0, fadeAlpha - dt / MASCOT_CROSSFADE_MS);
		const info = MASCOT_CLIPS[clip];
		if (!hasFrames(clip)) return; // static picture

		clipTime += dt;
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

	const size = $derived({ width: placement.height * ASPECT, height: placement.height });
</script>

<BoardContainer>
	<Container
		x={context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * placement.x}
		y={context.stateGameDerived.boardLayout().height + SYMBOL_SIZE * placement.y}
	>
		<Sprite key={currentKey} anchor={{ x: 0.5, y: 1 }} {...size} />
		<!-- always mounted, so it always stays above the current frame -->
		<Sprite
			key={fadeKey ?? currentKey}
			anchor={{ x: 0.5, y: 1 }}
			alpha={fadeAlpha}
			visible={fadeAlpha > 0}
			{...size}
		/>
	</Container>
</BoardContainer>
