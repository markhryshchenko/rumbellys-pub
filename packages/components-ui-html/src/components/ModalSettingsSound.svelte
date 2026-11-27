<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getContextEventEmitter } from 'utils-event-emitter';
	import { Button } from 'components-shared';

	import BaseIcon from './BaseIcon.svelte';
	import BaseButtonContent from './BaseButtonContent.svelte';
	import type { EmitterEventModal } from '../types';

	type Props = {
		value: number;
		children: Snippet;
	};

	let { value = $bindable(), children }: Props = $props();
	const { eventEmitter } = getContextEventEmitter<EmitterEventModal>();
	const ICONS = { on: 'volumeOn', off: 'volumeOff' } as const;
	// Rumbelly's Pub palette, same as the replay controls and the free spins panel
	const GOLD = '#f2b632';
	const DARK = '#0d0603';
	const BORDER = '#c8902e';
</script>

<div class="col">
	<span class="label">{@render children()}</span>
	<div class="row">
		<!-- button -->
		<div class="button-wrap">
			<Button
				onclick={() => {
					eventEmitter.broadcast({ type: 'soundPressGeneral' });
					if (value === 0) {
						value = 50;
					} else {
						value = 0;
					}
				}}
			>
				<BaseIcon
					width="3rem"
					height="3rem"
					background={value > 0 ? GOLD : DARK}
					border="2px solid {BORDER}"
				/>
				<BaseButtonContent>
					<span class="toggle-text" class:on={value > 0}>{value > 0 ? 'ON' : 'OFF'}</span>
				</BaseButtonContent>
			</Button>
		</div>

		<!-- range -->
		<input bind:value type="range" min="0" max="100" class="range" style="--fill: {value}%" />

		<!-- value -->
		<div class="value">
			<span>{value}</span>
		</div>
	</div>
</div>

<style lang="scss">
	.col {
		--gold: #f2b632;
		--gold-light: #ffd36b;
		--border: #c8902e;
		--dark: #1a0f08;
		--track: #2a160a;
		--cream: #fff4dc;

		display: flex;
		flex-direction: column;
	}

	.label {
		color: var(--gold-light);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.toggle-text {
		color: var(--cream);
		font-weight: 700;

		&.on {
			color: var(--dark);
		}
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.button-wrap {
		width: 15%;
		display: flex;
		align-items: center;
	}

	.range {
		width: 70%;
		align-self: center;
		height: 0.6rem;
		margin: 0;
		appearance: none;
		-webkit-appearance: none;
		border: 2px solid var(--border);
		border-radius: 1rem;
		background: linear-gradient(
			to right,
			var(--gold) 0%,
			var(--gold) var(--fill),
			var(--track) var(--fill),
			var(--track) 100%
		);
		cursor: pointer;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			width: 1.3rem;
			height: 1.3rem;
			border: 3px solid var(--dark);
			border-radius: 50%;
			background: var(--gold-light);
		}

		&::-moz-range-thumb {
			width: 1.3rem;
			height: 1.3rem;
			box-sizing: border-box;
			border: 3px solid var(--dark);
			border-radius: 50%;
			background: var(--gold-light);
		}

		&:focus-visible {
			outline: 2px solid var(--gold-light);
			outline-offset: 3px;
		}
	}

	.value {
		width: 15%;
		color: var(--cream);
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
