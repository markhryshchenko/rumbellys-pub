import { i18n, type Messages } from '@lingui/core';
import { type Language } from './stateUrl.svelte';

export const stateI18n = $state({
	i18n
});

export const stateI18nDerived = {
	init: (lang: Language, messages: Messages) => {
		stateI18n.i18n.load(lang, messages as Messages);
		stateI18n.i18n.activate(lang);
	},
	// `value` is the English source text (message id); `values` fill placeholders like {total}.
	// Messages are loaded raw (not compiled by Lingui), so placeholders are replaced here.
	translate: (value: string, values?: Record<string, string | number>) => {
		const text = stateI18n.i18n._(value);
		if (!values) return text;
		return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? `${values[key]}` : match));
	},
};
