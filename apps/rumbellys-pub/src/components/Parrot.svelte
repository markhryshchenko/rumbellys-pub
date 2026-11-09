<script lang="ts">
	import { onMount } from 'svelte';

	import { MainContainer } from 'components-layout';
	import { SpriteSheet } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';

	import { getContext } from '../game/context';

	// Rumbelly's parrot on a rum keg, bottom left of the desktop layout, facing the reels.
	// Frames come from parrot_idle.mp4 (art/tools/build_scene.py): smiles and blinks.
	// Starts 3 s after the game shows, plays once (~5 s), rests on the first frame, repeats.
	const FRAME_FPS = 9.6; // parrot.json meta.fps
	const ASPECT = 184 / 260; // one frame (parrot.json frame size)
	const HEIGHT = 260;
	// standard 1920x1080 space, bottom aligned: on the floor left of the bottom UI row
	const POSITION = { x: 350, y: 960 };
	const START_DELAY = 3000;
	const PAUSE = 3000;

	const context = getContext();
	const show = $derived(context.stateLayoutDerived.layoutType() === 'desktop');

	let playing = $state(false);
	let finished = () => {};

	onMount(() => {
		let alive = true;
		(async () => {
			await waitForTimeout(START_DELAY);
			while (alive) {
				playing = true;
				await new Promise<void>((resolve) => (finished = resolve));
				playing = false;
				await waitForTimeout(PAUSE);
			}
		})();
		return () => {
			alive = false;
			finished();
		};
	});
</script>

{#if show}
	<MainContainer standard alignVertical="bottom">
		<SpriteSheet
			key="parrot"
			anchor={{ x: 0.5, y: 1 }}
			{...POSITION}
			width={HEIGHT * ASPECT}
			height={HEIGHT}
			animationSpeed={FRAME_FPS / 60}
			loop={false}
			play={playing}
			onComplete={() => finished()}
		/>
	</MainContainer>
{/if}
