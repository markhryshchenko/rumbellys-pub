<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MODE_BASE/bookEvent',
	});
</script>

<script lang="ts">
	import {
		StoryGameTemplate,
		StoryLocale,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';

	import type { Language } from 'state-shared';

	import Game from '../components/Game.svelte';
	import messagesMap from '../i18n/messagesMap';
	import { setContext } from '../game/context';
	import { playBookEvent } from '../game/utils';
	import events from './data/base_events';

	setContext();
</script>

{#snippet template(args: TemplateArgs<any>, storyContext: { globals: { locale?: Language } })}
	<StoryGameTemplate
		skipLoadingScreen={args.skipLoadingScreen}
		action={async () => {
			await args.action?.(args.data);
		}}
	>
		<!-- language from the "Language" switch in the Storybook toolbar -->
		<StoryLocale lang={storyContext.globals.locale ?? 'en'} {messagesMap}>
			<Game />
		</StoryLocale>
	</StoryGameTemplate>
{/snippet}

<Story
	name="reveal"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.reveal,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="setTotalWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.setTotalWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="freeSpinTrigger"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.freeSpinTrigger,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="updateFreeSpin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.updateFreeSpin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="winInfo"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.winInfo,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="setWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.setWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="freeSpinEnd"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.freeSpinEnd,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<Story
	name="finalWin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: events.finalWin,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>

<!-- big win levels (amount in book units: 100 = 1x the total bet) -->
<Story
	name="setWin_big"
	args={templateArgs({
		skipLoadingScreen: true,
		data: { index: 0, type: 'setWin', amount: 2000, winLevel: 6 } as const,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
<Story
	name="setWin_super"
	args={templateArgs({
		skipLoadingScreen: true,
		data: { index: 0, type: 'setWin', amount: 4000, winLevel: 7 } as const,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
<Story
	name="setWin_mega"
	args={templateArgs({
		skipLoadingScreen: true,
		data: { index: 0, type: 'setWin', amount: 7500, winLevel: 8 } as const,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
<Story
	name="setWin_epic"
	args={templateArgs({
		skipLoadingScreen: true,
		data: { index: 0, type: 'setWin', amount: 25000, winLevel: 9 } as const,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
<Story
	name="setWin_max"
	args={templateArgs({
		skipLoadingScreen: true,
		data: { index: 0, type: 'setWin', amount: 500000, winLevel: 10 } as const,
		action: async (data) => await playBookEvent(data, { bookEvents: [] }),
	})}
	{template}
/>
