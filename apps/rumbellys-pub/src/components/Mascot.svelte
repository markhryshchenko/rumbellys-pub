<script lang="ts" module>
	export type EmitterEventMascot =
		| { type: 'mascotDrink' }
		| { type: 'mascotCheer' };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut, sineInOut } from 'svelte/easing';

	import { Container, Sprite } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	// Rumbelly faces left, feet on the floor in front of the bar. Poses are code tweens on the
	// single character image until real drink / cheer animations exist.
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
	const position = $derived({
		x: context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * placement.x,
		y: context.stateGameDerived.boardLayout().height + SYMBOL_SIZE * placement.y,
	});

	const breathe = new Tween(1, { duration: 1400, easing: sineInOut });
	const tilt = new Tween(0, { easing: cubicOut });
	const jump = new Tween(0, { easing: cubicOut });

	const timed = (ms: number) => ms / stateBetDerived.timeScale();

	onMount(() => {
		let alive = true;
		(async () => {
			while (alive) {
				await breathe.set(1.025);
				await breathe.set(1);
			}
		})();
		return () => (alive = false);
	});

	context.eventEmitter.subscribeOnMount({
		mascotDrink: async () => {
			// lean back and lift the mug
			await tilt.set(0.12, { duration: timed(220) });
			await tilt.set(0, { duration: timed(320) });
		},
		mascotCheer: async () => {
			await jump.set(-SYMBOL_SIZE * 0.35, { duration: timed(200) });
			await jump.set(0, { duration: timed(350) });
		},
	});
</script>

<BoardContainer>
	<Container x={position.x} y={position.y + jump.current} rotation={tilt.current}>
		<Sprite
			key="rumbelly"
			anchor={{ x: 0.5, y: 1 }}
			width={placement.height * ASPECT}
			height={placement.height * breathe.current}
		/>
	</Container>
</BoardContainer>
