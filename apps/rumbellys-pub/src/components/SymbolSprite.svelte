<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { Tween } from 'svelte/motion';

	import { Sprite } from 'pixi-svelte';
	import { stateBetDerived } from 'state-shared';

	import { getContext } from '../game/context';
	import { getSymbolInfo } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';
	import type { SymbolState } from '../game/types';

	type Props = {
		x?: number;
		y?: number;
		symbolInfo: ReturnType<typeof getSymbolInfo>;
		state: SymbolState;
		oncomplete?: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	// Win presentation for every symbol: the symbol pulses twice over a warm gold glow, the other
	// symbols get darker. Symbols with win frames (coin: light sweep) also play them.
	const WIN_TIME = 900; // ms at normal speed
	const PULSES = 2;
	const PULSE_SCALE = 0.14; // extra size at the top of a pulse
	const GLOW_SIZE = SYMBOL_SIZE * 1.7;
	const GLOW_TINT = 0xffc35a;
	const DIM_GREY = 0x55; // 0xff = normal colour
	const DIM_TIME = 200;

	// ms since the win started (null: not winning)
	let winTime = $state<number | null>(null);
	let frameId = 0;

	const stopWin = () => {
		cancelAnimationFrame(frameId);
		winTime = null;
	};

	const startWin = () => {
		stopWin();
		winTime = 0;
		let last = 0;
		const tick = (now: number) => {
			if (last && winTime !== null) winTime += (now - last) * stateBetDerived.timeScale();
			last = now;
			if (winTime !== null && winTime >= WIN_TIME) {
				stopWin();
				props.oncomplete?.();
				return;
			}
			frameId = requestAnimationFrame(tick);
		};
		frameId = requestAnimationFrame(tick);
	};

	// "win" waits for the animation; any other state is done at once (land -> static)
	$effect(() => {
		const state = props.state;
		untrack(() => {
			if (state === 'win') {
				startWin();
			} else {
				stopWin();
				props.oncomplete?.();
			}
		});
	});

	onDestroy(stopWin);

	const progress = $derived(winTime === null ? 0 : winTime / WIN_TIME);
	// 0..1..0 PULSES times
	const pulse = $derived(Math.abs(Math.sin(progress * Math.PI * PULSES)));
	// glow: in fast, out at the end
	const glowAlpha = $derived(
		winTime === null ? 0 : Math.min(progress / 0.15, (1 - progress) / 0.2, 1) * (0.5 + 0.4 * pulse),
	);
	const scale = $derived(1 + PULSE_SCALE * pulse);

	// symbols with win frames play them once over the win (frame 0 = the static symbol)
	const winFrames = $derived('winFrames' in props.symbolInfo ? props.symbolInfo.winFrames : undefined);
	const frame = $derived.by(() => {
		if (!winFrames || winTime === null) return undefined;
		const index = Math.min(Math.floor(progress * winFrames.count), winFrames.count - 1);
		return { key: `${winFrames.prefix}_${String(index).padStart(2, '0')}`, size: winFrames.cellScale };
	});

	const dim = new Tween(0, { duration: DIM_TIME });
	$effect(() => {
		dim.set(context.stateGame.symbolsDimmed && props.state !== 'win' ? 1 : 0);
	});
	const tint = $derived.by(() => {
		const grey = Math.round(0xff - (0xff - DIM_GREY) * dim.current);
		return grey * 0x010101;
	});
</script>

<!-- glow first: under the symbol; always mounted so it never jumps above it -->
<Sprite
	key="lanternGlow"
	anchor={0.5}
	blendMode="add"
	tint={GLOW_TINT}
	alpha={glowAlpha}
	visible={glowAlpha > 0}
	x={props.x}
	y={props.y}
	width={GLOW_SIZE}
	height={GLOW_SIZE}
/>

<Sprite
	x={props.x}
	y={props.y}
	anchor={0.5}
	key={frame?.key ?? props.symbolInfo.assetKey}
	{tint}
	width={SYMBOL_SIZE * props.symbolInfo.sizeRatios.width * scale * (frame?.size ?? 1)}
	height={SYMBOL_SIZE * props.symbolInfo.sizeRatios.height * scale * (frame?.size ?? 1)}
/>
