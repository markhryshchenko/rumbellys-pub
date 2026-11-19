<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'COMPONENTS/<Game>',
	});
</script>

<script lang="ts">
	import {
		StoryLocale,
		StoryGameTemplate,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';

	import { stateBet } from 'state-shared';

	import { stateGame, stateGameDerived } from '../game/stateGame.svelte';
	import type { Language } from 'state-shared';

	import Game from '../components/Game.svelte';
	import messagesMap from '../i18n/messagesMap';
	import { setContext } from '../game/context';
	import { eventEmitter } from '../game/eventEmitter';
	import config from '../game/config';

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

<Story name="component (loadingScreen)">
	{#snippet template(_args, storyContext: { globals: { locale?: Language } })}
		<StoryLocale lang={storyContext.globals.locale ?? 'en'} {messagesMap}>
			<Game />
		</StoryLocale>
	{/snippet}
</Story>

<Story
	name="preSpin"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			await stateGameDerived.enhancedBoard.preSpin({
				paddingBoard: config.paddingReels[stateGame.gameType],
			});
		},
	})}
	{template}
/>

<!-- balance / bet / win with very long amounts: they must shrink, not overlap -->
<Story
	name="ui: long amounts"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			stateBet.balanceAmount = 987_654_321.99;
			stateBet.betAmount = 20_000;
			stateBet.wageredBetAmount = 20_000;
			// 5000x max win (book amounts: 100 = 1x the bet)
			stateBet.winBookEventAmount = 5000 * 100;
		},
	})}
	{template}
/>

<Story
	name="emitterEvent: boardHide"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
		action: async () => {
			eventEmitter.broadcast({ type: 'boardHide' });
		},
	})}
	{template}
/>
