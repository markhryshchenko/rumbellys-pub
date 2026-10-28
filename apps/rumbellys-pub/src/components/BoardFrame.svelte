<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const SPINE_SCALE = { width: 0.62, height: 0.66 };
	const POSITION_ADJUSTMENT = 1.01;
	// wooden frame built by art/tools/build_scene.py (9-slice); its opening = board + 4%.
	// Sizes in game units = image size / 2. Portrait gets a thinner frame (reels fill the width).
	const FRAME = {
		normal: { key: 'reelFrame', width: 765.5, height: 466 },
		portrait: { key: 'reelFramePortrait', width: 676.5, height: 408 },
	};
	// planks a little bigger than the board, so the frame covers their edges
	const REEL_BACKGROUND_OVERLAP = 1.06;

	const frame = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait' ? FRAME.portrait : FRAME.normal,
	);

	type AnimationName = 'reelhouse_glow_start' | 'reelhouse_glow_idle' | 'reelhouse_glow_exit';

	let animationName = $state<AnimationName | undefined>(undefined);
	let loop = $state(false);

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => {
			animationName = 'reelhouse_glow_start';
			loop = false;
		},
		boardFrameGlowHide: () => {
			if (animationName) animationName = 'reelhouse_glow_exit';
		},
	});
</script>

{#if animationName}
	<SpineProvider
		zIndex={-1}
		key="reelhouse"
		x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT}
		y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT}
		width={context.stateGameDerived.boardLayout().width * SPINE_SCALE.width}
		height={context.stateGameDerived.boardLayout().height * SPINE_SCALE.height}
	>
		<SpineTrack
			trackIndex={0}
			{animationName}
			{loop}
			listener={{
				complete: (entry) => {
					if (entry.animation) {
						if (entry.animation.name === 'reelhouse_glow_start') {
							animationName = 'reelhouse_glow_idle';
							loop = true;
						}

						if (entry.animation.name === 'reelhouse_glow_exit') {
							animationName = undefined;
							loop = false;
						}
					}
				},
			}}
		/>
	</SpineProvider>
{/if}

<!-- dark wood behind the reels -->
<Sprite
	key="reelBackground"
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x}
	y={context.stateGameDerived.boardLayout().y}
	width={context.stateGameDerived.boardLayout().width * REEL_BACKGROUND_OVERLAP}
	height={context.stateGameDerived.boardLayout().height * REEL_BACKGROUND_OVERLAP}
/>

<Sprite
	key={frame.key}
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x}
	y={context.stateGameDerived.boardLayout().y}
	width={frame.width}
	height={frame.height}
/>
