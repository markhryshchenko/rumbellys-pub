<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { Container, Sprite, Text, type Sizes } from 'pixi-svelte';
	import { stateI18nDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE, titleTextStyle } from '../game/constants';
	import { winLevelMap, type WinLevel } from '../game/winLevelMap';

	type Props = {
		// count-up amount in book units (100 = 1x the total bet)
		countUpAmount: number;
		// formatted count-up amount
		amountText: string;
		// win level of the whole win (6 big ... 10 max)
		finalLevel: WinLevel;
	};

	const props: Props = $props();
	const context = getContext();

	// Same thresholds as the math SDK (config.get_win_level, "standard"): the title climbs
	// BIG -> SUPER -> MEGA -> EPIC -> MAX while the amount counts up.
	const LEVEL_FROM_MULTIPLIER: [WinLevel, number][] = [
		[10, 5000],
		[9, 100],
		[8, 50],
		[7, 30],
		[6, 0],
	];

	const reachedLevel = $derived.by(() => {
		const multiplier = props.countUpAmount / 100;
		const [level] = LEVEL_FROM_MULTIPLIER.find(([, from]) => multiplier >= from) ?? [6];
		return Math.min(level, props.finalLevel) as WinLevel;
	});
	const title = $derived(stateI18nDerived.translate(winLevelMap[reachedLevel].text ?? ''));

	// "punch" every time the title goes up a level
	const punch = new Tween(1, { duration: 450, easing: backOut });
	let shownLevel = 0;
	$effect(() => {
		if (reachedLevel === shownLevel) return;
		shownLevel = reachedLevel;
		punch.set(1.35, { duration: 0 }).then(() => punch.set(1));
		context.eventEmitter.broadcast({ type: 'mascotPlay', clip: 'bigWin' });
	});

	// sign art (art/tools/bigwin_sign.py): 1200x350 px, the empty board is the text area
	const SIGN_ASPECT = 1200 / 350;
	const SIGN_TEXT_AREA = { left: 0.117, top: 0.243, right: 0.883, bottom: 0.749 };
	const SIGN_WIDTH = SYMBOL_SIZE * 6.2; // fits the 800 units wide portrait layout
	const SIGN_HEIGHT = SIGN_WIDTH / SIGN_ASPECT;
	const SIGN_Y = -SYMBOL_SIZE * 0.75;
	// text area centre relative to the sign centre (the board is not exactly in the middle)
	const TITLE_Y = SIGN_HEIGHT * ((SIGN_TEXT_AREA.top + SIGN_TEXT_AREA.bottom) / 2 - 0.5);
	// a little padding inside the board
	const TITLE_MAX = {
		width: SIGN_WIDTH * (SIGN_TEXT_AREA.right - SIGN_TEXT_AREA.left) * 0.9,
		height: SIGN_HEIGHT * (SIGN_TEXT_AREA.bottom - SIGN_TEXT_AREA.top) * 0.95,
	};
	const AMOUNT_MAX = { width: SYMBOL_SIZE * 6.5, height: Infinity };

	// long translations shrink to fit
	let titleSizes: Sizes = $state({ width: 0, height: 0 });
	let amountSizes: Sizes = $state({ width: 0, height: 0 });
	const fit = (sizes: Sizes, max: Sizes) =>
		Math.min(1, sizes.width ? max.width / sizes.width : 1, sizes.height ? max.height / sizes.height : 1);

	const textStyle = (fontSize: number) => titleTextStyle(fontSize);
</script>

<!-- wooden sign with the level title; the whole sign "punches" on every new level -->
<Container y={SIGN_Y} scale={punch.current}>
	<Sprite key="bigWinSign" anchor={0.5} width={SIGN_WIDTH} height={SIGN_HEIGHT} />
	<Container y={TITLE_Y} scale={fit(titleSizes, TITLE_MAX)}>
		<Text
			anchor={0.5}
			text={title}
			style={textStyle(SYMBOL_SIZE * 0.8)}
			onresize={(sizes) => (titleSizes = sizes)}
		/>
	</Container>
</Container>

<Container y={SYMBOL_SIZE * 0.8} scale={fit(amountSizes, AMOUNT_MAX)}>
	<Text
		anchor={0.5}
		text={props.amountText}
		style={textStyle(SYMBOL_SIZE * 1.05)}
		onresize={(sizes) => (amountSizes = sizes)}
	/>
</Container>
