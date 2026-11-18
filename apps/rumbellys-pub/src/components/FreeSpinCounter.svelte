<script lang="ts" module>
	export type EmitterEventFreeSpinCounter =
		| { type: 'freeSpinCounterShow' }
		| { type: 'freeSpinCounterHide' }
		| { type: 'freeSpinCounterUpdate'; current?: number; total?: number };
</script>

<script lang="ts">
	import { MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import {
		FREE_SPIN_PANEL,
		GAME_FONT_FAMILY,
		GAME_TEXT_GOLD,
		SYMBOL_SIZE,
	} from '../game/constants';
	import { i18nDerived } from '../i18n/i18nDerived';
	import { anchorToPivot, Container, Text, type Sizes } from 'pixi-svelte';

	const context = getContext();
	// top part of the free spins side panel; the dark backing is drawn by BellyMeter
	// (the web-sdk sample frame `Frame_FSCounter.png` is no longer used)
	const center = {
		x: FREE_SPIN_PANEL.x + FREE_SPIN_PANEL.width / 2,
		y: FREE_SPIN_PANEL.y + FREE_SPIN_PANEL.padding / 2 + FREE_SPIN_PANEL.counterHeight / 2,
	};
	const maxWidth = FREE_SPIN_PANEL.width - FREE_SPIN_PANEL.padding * 2;

	const fontSize = SYMBOL_SIZE * 0.275;

	let show = $state(false);
	let current = $state(0);
	let total = $state(0);
	let titleSizes: Sizes = $state({ width: 0, height: 0 });
	let counterSizes: Sizes = $state({ width: 0, height: 0 });

	const textContainerSizes = $derived({
		width: titleSizes.width,
		height: titleSizes.height + counterSizes.height,
	});
	const counterPosition = $derived({ x: titleSizes.width / 2, y: titleSizes.height });

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (show = true),
		freeSpinCounterHide: () => (show = false),
		freeSpinCounterUpdate: (emitterEvent) => {
			if (emitterEvent.current !== undefined) current = emitterEvent.current;
			if (emitterEvent.total !== undefined) total = emitterEvent.total;
		},
	});
</script>

<MainContainer>
	<BoardContainer>
		<FadeContainer {show}>
			<Container
				{...center}
				scale={textContainerSizes.width > maxWidth ? maxWidth / textContainerSizes.width : 1}
				pivot={anchorToPivot({
					sizes: textContainerSizes,
					anchor: { x: 0.5, y: 0.5 },
				})}
			>
				<Text
					text={i18nDerived.freeSpins()}
					style={{
						...GAME_TEXT_GOLD,
						fontFamily: GAME_FONT_FAMILY,
						fontSize,
						fontWeight: 'bold',
						wordWrap: false,
					}}
					onresize={(sizes) => (titleSizes = sizes)}
				/>
				<Text
					text={i18nDerived.freeSpinOf(current, total)}
					{...counterPosition}
					anchor={{ x: 0.5, y: 0 }}
					style={{
						...GAME_TEXT_GOLD,
						fontFamily: GAME_FONT_FAMILY,
						fontSize,
						fontWeight: 'bold',
					}}
					onresize={(sizes) => (counterSizes = sizes)}
				/>
			</Container>
		</FadeContainer>
	</BoardContainer>
</MainContainer>
