<script lang="ts" module>
	// Text lines on the free spins panel, in panel space (0,0 = panel centre, game units).
	export const FS_PANEL_TEXT = {
		maxWidth: 460, // the frame opening is ~500 wide
		title: { y: -110, fontSize: 52 }, // RUMBELLY'S ROUNDS
		subtitle: { y: -52, fontSize: 36 }, // YOU WON
		number: { y: 22, fontSize: 92 }, // 10 / win amount
		bottom: { y: 105, fontSize: 40 }, // FREE SPINS / TOTAL WIN
	};
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { Container, Sprite } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	import GoldGlow from './GoldGlow.svelte';
	import { getContext } from '../game/context';
	import { BOARD_SIZES, REEL_BACKGROUND_OVERLAP, REEL_FRAME } from '../game/constants';

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();
	const context = getContext();

	// Free spins intro / outro panel: the reel frame and planks of the main game, smaller,
	// with a warm lantern glow behind it.
	const PANEL_SCALE = 0.8;

	const frame = $derived(
		context.stateLayoutDerived.layoutType() === 'portrait' ? REEL_FRAME.portrait : REEL_FRAME.normal,
	);

	// pop in
	const scale = new Tween(0.6, { duration: 450, easing: backOut });
	onMount(() => {
		scale.set(1);
	});
</script>

<MainContainer>
	<Container
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y}
		scale={scale.current}
	>
		<GoldGlow width={frame.width * 1.7} height={frame.width * 1.7} />
		<Container scale={PANEL_SCALE}>
			<Sprite
				key="reelBackground"
				anchor={0.5}
				width={BOARD_SIZES.width * REEL_BACKGROUND_OVERLAP}
				height={BOARD_SIZES.height * REEL_BACKGROUND_OVERLAP}
			/>
			<Sprite key={frame.key} anchor={0.5} width={frame.width} height={frame.height} />
		</Container>

		{@render props.children()}
	</Container>
</MainContainer>
