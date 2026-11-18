<script lang="ts" module>
	import type { Position } from '../game/types';

	export type EmitterEventLineWinAmount =
		| { type: 'lineWinAmountShow'; amount: number; position: Position }
		| { type: 'lineWinAmountHide' };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { Container } from 'pixi-svelte';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import BoardContainer from './BoardContainer.svelte';
	import TitleText from './TitleText.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import { getSymbolX, getSymbolY } from '../game/utils';

	const context = getContext();

	// Win of one line, over the middle symbol of the line, while the lines are shown one by one.
	let text = $state('');
	let x = $state(0);
	let y = $state(0);
	const scale = new Tween(0, { duration: 250, easing: backOut });

	context.eventEmitter.subscribeOnMount({
		lineWinAmountShow: ({ amount, position }) => {
			text = bookEventAmountToCurrencyString(amount);
			x = getSymbolX(position.reel);
			y = getSymbolY(position.row);
			scale.set(0, { duration: 0 });
			scale.set(1);
		},
		lineWinAmountHide: () => {
			scale.set(0, { duration: 0 });
		},
	});
</script>

<BoardContainer>
	<Container {x} {y} scale={scale.current} visible={scale.current > 0}>
		<TitleText {text} fontSize={SYMBOL_SIZE * 0.42} maxWidth={SYMBOL_SIZE * 2.6} />
	</Container>
</BoardContainer>
