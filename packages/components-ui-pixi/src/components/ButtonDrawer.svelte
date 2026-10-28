<script lang="ts">
	import { cubicInOut } from 'svelte/easing';

	import { stateUi } from 'state-shared';
	import { Button, type ButtonProps } from 'components-pixi';

	import UiRound from './UiRound.svelte';
	import UiIcon from './UiIcon.svelte';
	import { UI_BASE_SIZE } from '../constants';
	import { getContext } from '../context';
	import { Tween } from 'svelte/motion';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const sizes = { width: UI_BASE_SIZE, height: UI_BASE_SIZE };

	const degreesToRads = (degrees: number) => (degrees * Math.PI) / 180.0;

	const DRAWER_ROTATION = {
		up: degreesToRads(-180),
		down: degreesToRads(0),
	};

	const rotationTween = new Tween(stateUi.drawerFold ? DRAWER_ROTATION.up : DRAWER_ROTATION.down, {
		easing: cubicInOut,
	});

	let moving = $state(false);
	const disabled = $derived(props.disabled || moving);

	const onpress = async () => {
		if (stateUi.drawerFold) {
			await context.eventEmitter.broadcastAsync({ type: 'drawerUnfold' });
		} else {
			await context.eventEmitter.broadcastAsync({ type: 'drawerFold' });
		}
	};

	context.eventEmitter.subscribeOnMount({
		drawerUnfold: async () => {
			if (stateUi.drawerFold) {
				moving = true;
				await rotationTween.set(DRAWER_ROTATION.down);
				stateUi.drawerFold = false;
				moving = false;
			}
		},
		drawerFold: async () => {
			if (!stateUi.drawerFold) {
				moving = true;
				await rotationTween.set(DRAWER_ROTATION.up);
				stateUi.drawerFold = true;
				moving = false;
			}
		},
	});
</script>

<Button {...props} {sizes} {onpress} {disabled} alpha={disabled ? 0.5 : 1}>
	{#snippet children({ center })}
		<UiRound {...center} diameter={sizes.width * 0.7}>
			<UiIcon name="drawer" size={sizes.width * 0.38} rotation={rotationTween.current} />
		</UiRound>
	{/snippet}
</Button>
