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

	// Rumbelly stands right of the reels, facing left. Poses are code tweens on the single
	// character image until real drink / cheer animations exist.
	const HEIGHT = SYMBOL_SIZE * 3.6;
	const WIDTH = HEIGHT * (565 / 768);

	const context = getContext();
	const position = $derived({
		x: context.stateGameDerived.boardLayout().width + SYMBOL_SIZE * 0.35 + WIDTH / 2,
		y: context.stateGameDerived.boardLayout().height + SYMBOL_SIZE * 0.2,
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
			width={WIDTH}
			height={HEIGHT * breathe.current}
		/>
	</Container>
</BoardContainer>
