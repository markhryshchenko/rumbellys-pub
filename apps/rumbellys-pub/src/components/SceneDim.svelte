<script lang="ts">
	import { Graphics, type GraphicsProps } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import { MASCOT_PLACEMENT, mascotSpot } from '../game/mascot';

	// Dark veil under the popups (free spins intro / outro, big win). Rumbelly stays bright: he
	// reacts to these moments, so the veil has a soft hole around him (mascotSpot).
	type Props = { alpha?: number };

	const props: Props = $props();
	const context = getContext();

	const RINGS = 24; // steps of the soft edge
	const FAR = SYMBOL_SIZE * 60; // bigger than any canvas

	const spot = $derived(
		mascotSpot(
			MASCOT_PLACEMENT[context.stateLayoutDerived.layoutType() === 'portrait' ? 'portrait' : 'normal'],
			SYMBOL_SIZE,
			context.stateGameDerived.boardLayout(),
		),
	);

	const draw: GraphicsProps['draw'] = (graphics) => {
		const { x, y, clear, outer } = spot;
		const alpha = props.alpha ?? 0.5;
		const radius = (t: number) => ({
			x: clear.x + (outer.x - clear.x) * t,
			y: clear.y + (outer.y - clear.y) * t,
		});

		// everything outside the spot
		graphics.rect(-FAR, -FAR, FAR * 2, FAR * 2).fill({ color: 0x000000, alpha });
		graphics.ellipse(x, y, outer.x, outer.y).cut();

		// the soft edge: rings from clear (no veil) to outer (full veil)
		for (let ring = 0; ring < RINGS; ring++) {
			const t = (ring + 0.5) / RINGS;
			const smooth = t * t * (3 - 2 * t);
			const from = radius(ring / RINGS);
			const to = radius((ring + 1) / RINGS);
			graphics.ellipse(x, y, to.x, to.y).fill({ color: 0x000000, alpha: alpha * smooth });
			graphics.ellipse(x, y, from.x, from.y).cut();
		}
	};
</script>

<MainContainer>
	<BoardContainer>
		<Graphics {draw} />
	</BoardContainer>
</MainContainer>
