<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import GoldGlow from './GoldGlow.svelte';
	import { getContext } from '../game/context';
	import { REEL_BACKGROUND_OVERLAP, REEL_FRAME as FRAME } from '../game/constants';

	const context = getContext();
	// game title: the loading screen's sign, hanging over the top of the frame
	const SIGN_ASPECT = 1100 / 314; // loaderSign (art/tools/build_scene.py)
	const SIGN_WIDTH_OF_FRAME = 0.62;
	const SIGN_OVER_FRAME = 0.3; // part of the sign that overlaps the frame's top edge

	const frame = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait' ? FRAME.portrait : FRAME.normal,
	);
	const sign = $derived.by(() => {
		const width = frame.width * SIGN_WIDTH_OF_FRAME;
		const height = width / SIGN_ASPECT;
		const frameTop = context.stateGameDerived.boardLayout().y - frame.height / 2;
		return { width, height, y: frameTop - height * (0.5 - SIGN_OVER_FRAME) };
	});

	// free spins: warm lantern glow around the frame
	let glow = $state(false);

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => (glow = true),
		boardFrameGlowHide: () => (glow = false),
	});
</script>

<GoldGlow
	show={glow}
	x={context.stateGameDerived.boardLayout().x}
	y={context.stateGameDerived.boardLayout().y}
	width={frame.width * 1.45}
	height={frame.height * 1.6}
/>

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

<Sprite
	key="loaderSign"
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x}
	y={sign.y}
	width={sign.width}
	height={sign.height}
/>
