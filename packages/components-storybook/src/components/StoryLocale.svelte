<script lang="ts">
	import { i18n } from "@lingui/core";
	import { onMount, type Snippet } from "svelte";

	import { stateI18nDerived, type Language } from 'state-shared';
	import type { MessagesMap } from 'utils-shared/i18n';

	type Props = {
		lang: Language;
		// optional: real translations; without it the story is English with no messages (old behaviour)
		messagesMap?: MessagesMap;
		children: Snippet;
	};

	const props: Props = $props();

	onMount(async () => {
		if (props.messagesMap) return;
		i18n.load('en', {});
		i18n.activate('en');
	});

	// re-run when the "Language" toolbar switch changes props.lang
	$effect(() => {
		if (!props.messagesMap) return;
		const messages = props.messagesMap[props.lang];
		if (messages) stateI18nDerived.init(props.lang, messages);
		else stateI18nDerived.init('en', props.messagesMap.en ?? {});
	});
</script>

{@render props.children()}
