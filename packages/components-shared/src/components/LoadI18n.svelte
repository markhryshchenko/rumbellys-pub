<script lang="ts">
	// https://lingui.dev/installation#vite
	// https://lingui.dev/tutorials/javascript
	// https://lingui.dev/ref/vite-plugin

	import { stateI18nDerived } from 'state-shared';

	import { onMount, type Snippet } from 'svelte';
	import type { Messages } from '@lingui/core';

	import { stateUrlDerived, type Language } from 'state-shared';
	import type { MessagesMap } from 'utils-shared/i18n';

	type Props = {
		debug?: boolean;
		children: Snippet;
		messagesMap: MessagesMap;
		// social casino (?social=true): English only, with restricted gambling words replaced
		socialMessages?: Messages;
	};

	const props: Props = $props();

	let loaded = $state(false);

	const pickLanguage = (): { lang: Language; messages: Messages } => {
		if (stateUrlDerived.social()) {
			return { lang: 'en', messages: { ...props.messagesMap.en, ...props.socialMessages } };
		}
		const lang = stateUrlDerived.lang();
		const messages = props.messagesMap[lang];
		// unknown or empty `lang` falls back to English
		if (!messages) return { lang: 'en', messages: props.messagesMap.en ?? {} };
		return { lang, messages };
	};

	onMount(() => {
		try {
			const { lang, messages } = pickLanguage();
			if (props.debug) console.log({ lang, messages });
			stateI18nDerived.init(lang, messages);
		} catch (error) {
			console.error("Loading fallback locale 'en' without any messages because of error", error);
			stateI18nDerived.init('en', {});
		}
		loaded = true;
	});
</script>

{#if loaded}
	{@render props.children()}
{/if}
