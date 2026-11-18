import type { Preview } from '@storybook/svelte';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

const preview: Preview = {
	parameters: {
		layout: 'fullscreen',
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		viewport: {
			options: {
				...INITIAL_VIEWPORTS,
				stake: {
					name: 'stake iframe',
					styles: {
						width: '1200px',
						height: '675px',
					},
				},
				stakeMini: {
					name: 'stake mini player',
					styles: {
						width: '400px',
						height: '225px',
					},
				},
				stakeMiniExpanded: {
					name: 'stake mini player (expanded)',
					styles: {
						width: '800px',
						height: '450px',
					},
				},
			},
		},
	},
	// "Language" switch in the toolbar; stories read it from context.globals.locale
	globalTypes: {
		locale: {
			description: 'Game language',
			toolbar: {
				title: 'Language',
				icon: 'globe',
				dynamicTitle: true,
				items: ['en', 'ar', 'da', 'de', 'es', 'fi', 'fr', 'hi', 'id', 'ja', 'ko', 'pl', 'pt', 'ru', 'tr', 'vi', 'zh'],
			},
		},
	},
	initialGlobals: {
		viewport: { value: 'stake', isRotated: false },
		locale: 'en',
	},
};

export default preview;
