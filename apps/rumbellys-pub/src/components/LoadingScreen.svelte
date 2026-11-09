<script lang="ts">
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';

	import { AnimatedSprite, Container, Rectangle, REM, Sprite, Text, type LoadedSpriteSheet } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { MainContainer } from 'components-layout';
	import { waitForTimeout } from 'utils-shared/wait';

	import { getContext } from '../game/context';
	import PressToContinue from './PressToContinue.svelte';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	// image proportions (art/tools/build_scene.py)
	const RUMBELLY_ASPECT = 368 / 400;
	const SIGN_ASPECT = 1100 / 314;
	const BUBBLE_ASPECT = 900 / 458;
	const BAR_ASPECT = 1200 / 168;
	const BAR_SLOT = { left: 0.113, top: 0.3606, right: 0.8891, bottom: 0.6182 };
	const RUMBELLY_FPS = 9.6; // loaderRumbelly1.json meta.fps
	// one animation on two sheets: all frames in one would not fit a 2048 px texture
	const rumbellyFrames = $derived(
		['loaderRumbelly1', 'loaderRumbelly2'].flatMap(
			(key) => (context.stateApp.loadedAssets?.[key] ?? []) as LoadedSpriteSheet,
		),
	);

	const TIP_TIME = 5000;
	const TIP_FADE = 200;

	// Rumbelly is drawn first: the title sign hides the cut at the bottom of his picture
	const scene = $derived.by(() => {
		const { width: w, height: h } = context.stateLayoutDerived.mainLayout();
		const stacked = ['portrait', 'tablet'].includes(context.stateLayoutDerived.layoutType());

		const signWidth = stacked ? Math.min(w * 0.92, 640) : 640;
		const signHeight = signWidth / SIGN_ASPECT;
		const signY = h * (stacked ? 0.56 : 0.7);
		const rumbellyHeight = stacked ? Math.min(h * 0.36, w * 0.7) : h * 0.56;
		const bubbleWidth = stacked ? Math.min(w * 0.8, 480) : 460;
		const barWidth = stacked ? Math.min(w * 0.85, 540) : 540;

		return {
			centerX: w * 0.5,
			sign: { y: signY, width: signWidth, height: signHeight },
			rumbelly: {
				x: w * 0.5,
				y: signY + signHeight * 0.15,
				width: rumbellyHeight * RUMBELLY_ASPECT,
				height: rumbellyHeight,
			},
			glow: { y: signY - rumbellyHeight * 0.45, size: rumbellyHeight * 1.9 },
			bubble: {
				x: w * (stacked ? 0.56 : 0.77),
				y: h * (stacked ? 0.13 : 0.32),
				width: bubbleWidth,
				height: bubbleWidth / BUBBLE_ASPECT,
			},
			bar: { y: h * (stacked ? 0.76 : 0.9), width: barWidth, height: barWidth / BAR_ASPECT },
		};
	});

	const slot = $derived({
		x: scene.bar.width * BAR_SLOT.left,
		y: scene.bar.height * BAR_SLOT.top,
		width: scene.bar.width * (BAR_SLOT.right - BAR_SLOT.left),
		height: scene.bar.height * (BAR_SLOT.bottom - BAR_SLOT.top),
	});

	// Dev / Storybook only: stretches the loading bar over this many seconds, to watch the
	// animation (real loading is too fast). 0 = off. Always off in the production build.
	const DEBUG_LOADING_SECONDS = import.meta.env.DEV ? 10 : 0;
	const debugProgress = new Tween(0);
	const progress = $derived(
		DEBUG_LOADING_SECONDS ? debugProgress.current : context.stateApp.loadingProgress,
	);
	const loaded = $derived(context.stateApp.loaded && (!DEBUG_LOADING_SECONDS || progress === 100));
	const beerWidth = $derived((slot.width * progress) / 100);

	const tips = $derived(context.i18nDerived.loaderTips());
	let tipIndex = $state(_.random(9));
	const tipAlpha = new Tween(1);

	onMount(() => {
		if (DEBUG_LOADING_SECONDS) debugProgress.set(100, { duration: DEBUG_LOADING_SECONDS * 1000 });

		let alive = true;
		(async () => {
			while (alive) {
				await waitForTimeout(TIP_TIME);
				if (!alive) return;
				await tipAlpha.set(0, { duration: TIP_FADE });
				tipIndex = (tipIndex + 1) % tips.length;
				await tipAlpha.set(1, { duration: TIP_FADE });
			}
		})();
		return () => (alive = false);
	});
</script>

<!-- Rumbelly, title sign, speech bubble and loading bar -->
<FadeContainer show>
	<MainContainer>
		<Sprite
			key="lanternGlow"
			anchor={0.5}
			blendMode="add"
			alpha={0.4}
			x={scene.centerX}
			y={scene.glow.y}
			width={scene.glow.size}
			height={scene.glow.size}
		/>

		{#if rumbellyFrames.length}
			<AnimatedSprite
				textures={rumbellyFrames}
				anchor={{ x: 0.5, y: 1 }}
				{...scene.rumbelly}
				animationSpeed={RUMBELLY_FPS / 60}
				loop
				play
			/>
		{/if}

		<Sprite
			key="loaderSign"
			anchor={0.5}
			x={scene.centerX}
			y={scene.sign.y}
			width={scene.sign.width}
			height={scene.sign.height}
		/>

		<Container x={scene.bubble.x} y={scene.bubble.y}>
			<Sprite key="loaderBubble" anchor={0.5} width={scene.bubble.width} height={scene.bubble.height} />
			<!-- the middle of the parchment is a little above the picture's centre (the tail is below) -->
			<Text
				anchor={0.5}
				y={-scene.bubble.height * 0.06}
				alpha={tipAlpha.current}
				text={tips[tipIndex]}
				style={{
					align: 'center',
					wordWrap: true,
					breakWords: true,
					wordWrapWidth: scene.bubble.width * 0.62,
					fontFamily: 'proxima-nova',
					fontWeight: '700',
					fontSize: scene.bubble.width * 0.054,
					lineHeight: scene.bubble.width * 0.066,
					fill: 0x3a2310,
				}}
			/>
		</Container>

		{#if !loaded}
			<Container x={scene.centerX - scene.bar.width / 2} y={scene.bar.y - scene.bar.height / 2}>
				<Rectangle {...slot} backgroundColor={0x2a160a} />
				<Rectangle x={slot.x} y={slot.y} width={beerWidth} height={slot.height} backgroundColor={0xe09a20} />
				<!-- foam on the leading edge of the beer -->
				<Rectangle
					x={slot.x + Math.max(beerWidth - slot.height * 0.3, 0)}
					y={slot.y}
					width={Math.min(beerWidth, slot.height * 0.3)}
					height={slot.height}
					backgroundColor={0xfff6e0}
				/>
				<Sprite key="loaderBar" width={scene.bar.width} height={scene.bar.height} />
			</Container>
		{/if}
	</MainContainer>

	<Text
		x={REM}
		y={context.stateLayoutDerived.canvasSizes().height - REM * 0.6}
		anchor={{ x: 0, y: 1 }}
		alpha={0.75}
		text="TALUS PLAY"
		style={{
			fontFamily: 'proxima-nova',
			fontSize: REM * 0.85,
			fontWeight: '300',
			letterSpacing: REM * 0.1,
			fill: 0xffffff,
		}}
	/>
</FadeContainer>

<!-- press to continue -->
<FadeContainer show={loaded}>
	<PressToContinue y={scene.bar.y} onpress={props.onloaded} />
</FadeContainer>
