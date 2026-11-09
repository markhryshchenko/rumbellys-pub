<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { Text, type TextProps } from 'pixi-svelte';

	const props: Omit<TextProps, 'text'> = $props();
	const reactiveDate = new SvelteDate();
	const clock = $derived(
		reactiveDate.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
		}),
	);

	$effect(() => {
		const interval = setInterval(() => {
			reactiveDate.setTime(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<Text {...props} text={clock} />
