<script lang="ts">
	import { MainContainer, OnPressFullScreen } from 'components-layout';
	import { OnHotkey } from 'components-shared';
	import { Text } from 'pixi-svelte';

	import { getContext } from '../game/context';

	type Props = {
		// default: at the bottom of the screen
		y?: number;
		onpress: () => void;
	};

	const BOTTOM_MARGIN = 50;

	const props: Props = $props();
	const context = getContext();
</script>

<MainContainer alignVertical={props.y === undefined ? 'bottom' : undefined}>
	<Text
		anchor={0.5}
		x={context.stateLayoutDerived.mainLayout().width * 0.5}
		y={props.y ?? context.stateLayoutDerived.mainLayout().height - BOTTOM_MARGIN}
		text={context.i18nDerived.pressToContinue()}
		style={{
			align: 'center',
			wordWrap: true,
			breakWords: true,
			wordWrapWidth: context.stateLayoutDerived.mainLayout().width * 0.9,
			fontFamily: 'proxima-nova',
			fontWeight: '800',
			fontSize: 30,
			fill: 0xffffff,
			stroke: { color: 0x281408, width: 6 },
		}}
	/>
</MainContainer>
<OnHotkey hotkey="Space" onpress={() => props.onpress()} />
<OnPressFullScreen onpress={() => props.onpress()} />
