<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';

	import { Button, type ButtonProps } from 'components-pixi';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';
	import { waitForTimeout } from 'utils-shared/wait';

	import UiRound from './UiRound.svelte';
	import UiIcon from './UiIcon.svelte';
	import ButtonBetProvider from './ButtonBetProvider.svelte';
	import { UI_BASE_SIZE } from '../constants';
	import { getContext } from '../context';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	const sizes = { width: UI_BASE_SIZE, height: UI_BASE_SIZE };

	// Idle hint: 3 s after the game becomes idle the arrows make one turn in 2 s,
	// then snap back. Repeats while the player waits.
	const IDLE_DELAY = 3000;
	const TURN_DURATION = 2000;
	const SNAP_DURATION = 250;
	const FULL_TURN = Math.PI * 2;

	const rotation = new Tween(0);

	$effect(() => {
		if (!context.stateXstateDerived.isIdle()) {
			rotation.set(0, { duration: 0 });
			return;
		}

		let alive = true;
		(async () => {
			while (alive) {
				await waitForTimeout(IDLE_DELAY);
				if (!alive) return;
				await rotation.set(FULL_TURN, { duration: TURN_DURATION, easing: cubicInOut });
				if (!alive) return;
				await rotation.set(0, { duration: SNAP_DURATION, easing: cubicOut });
			}
		})();
		return () => (alive = false);
	});
</script>

<ButtonBetProvider>
	{#snippet children({ key, onpress })}
		{@const stop = key === 'stop_default' || key === 'stop_disabled'}
		<OnHotkey hotkey="Space" {disabled} {onpress} />
		<Button {...props} {sizes} {onpress} {disabled}>
			{#snippet children({ center, hovered, pressed })}
				<UiRound
					{...center}
					diameter={sizes.width}
					fillAlpha={0.65}
					{hovered}
					{pressed}
					disabled={disabled || key === 'spin_disabled' || key === 'stop_disabled'}
				>
					<UiIcon
						name={stop ? 'stop' : 'spin'}
						size={sizes.width * (stop ? 0.42 : 0.66)}
						rotation={stop ? 0 : rotation.current}
					/>
				</UiRound>
			{/snippet}
		</Button>
	{/snippet}
</ButtonBetProvider>
