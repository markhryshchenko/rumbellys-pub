<script lang="ts" module>
	// Still broadcast by the book event handlers; nothing plays them until Rumbelly gets
	// real animations (idle, drink, cheer) — for now he is a static picture.
	export type EmitterEventMascot =
		| { type: 'mascotDrink' }
		| { type: 'mascotCheer' };
</script>

<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	// Rumbelly faces left, feet on the floor in front of the bar.
	const ASPECT = 574 / 768; // rumbelly.webp
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
</script>

<BoardContainer>
	<Sprite
		key="rumbelly"
		anchor={{ x: 0.5, y: 1 }}
		x={context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * placement.x}
		y={context.stateGameDerived.boardLayout().height + SYMBOL_SIZE * placement.y}
		width={placement.height * ASPECT}
		height={placement.height}
	/>
</BoardContainer>
