<script lang="ts">
	import { stateBet, stateConfig, stateI18nDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import config from '../../game/config';

	// Every number comes from the math config or the RGS, so the rules always match the game.
	const t = stateI18nDerived.translate;

	const percent = (rtp: number) => `${(rtp * 100).toFixed(2)}%`;
	const bonusCost = config.betModes.bonus.cost;
	const maxWin = config.betModes.base.max_win;
	const bonusPrice = $derived(numberToCurrencyString(stateBet.betAmount * bonusCost));

	// bet levels come from /wallet/authenticate (empty in Storybook)
	const betLevels = $derived(stateConfig.betAmountOptions);
	const minBet = $derived(betLevels.length ? numberToCurrencyString(betLevels[0]) : '');
	const maxBet = $derived(
		betLevels.length ? numberToCurrencyString(betLevels[betLevels.length - 1]) : '',
	);
</script>

<div class="info">
	<h2>{t("RUMBELLY'S ROUNDS")}</h2>
	<ul class="rules">
		<li>{t('3, 4 or 5 SCATTER symbols anywhere award 8, 10 or 12 free spins.')}</li>
		<li>{t("During free spins, every MUG symbol that lands fills Rumbelly's mug meter.")}</li>
		<li>
			{t(
				'Every 4 mugs raise the multiplier for all wins: x2, x3, x5 and x10 (16 mugs). Each new multiplier also awards 2 extra free spins and applies from the next spin.',
			)}
		</li>
		<li>{t('3 or more SCATTER symbols during free spins award 5 extra free spins.')}</li>
	</ul>

	<h2>{t('BUY FREE SPINS')}</h2>
	<p>
		{t(
			"RUMBELLY'S ROUNDS can be bought for {cost}x the total bet ({price}). The round starts with 3 to 5 SCATTER symbols.",
			{ cost: bonusCost, price: bonusPrice },
		)}
	</p>

	<h2>{t('GAME INFORMATION')}</h2>
	<p>
		{t('Theoretical return to player (RTP): {base} in the base game, {bonus} for bought free spins.', {
			base: percent(config.betModes.base.rtp),
			bonus: percent(config.betModes.bonus.rtp),
		})}
	</p>
	<p>
		{t(
			'Maximum win: {max}x the total bet in every mode. When it is reached, the round ends and any remaining free spins are lost.',
			{ max: maxWin },
		)}
	</p>
	{#if minBet}
		<p>{t('Minimum bet: {min}. Maximum bet: {max}.', { min: minBet, max: maxBet })}</p>
	{/if}

	<h2>{t('HOW TO PLAY')}</h2>
	<ul class="rules">
		<li>{t('Press the spin button or the spacebar to start a round.')}</li>
		<li>{t('Use + and − to change the bet.')}</li>
		<li>{t('AUTO SPIN: choose the number of rounds and confirm to start. Press again to stop.')}</li>
		<li>{t('TURBO: faster spins.')}</li>
		<li>{t("BUY BONUS: start RUMBELLY'S ROUNDS right away. A confirmation is shown first.")}</li>
		<li>{t('MENU: paytable, game rules, settings and sound.')}</li>
		<li>{t('BALANCE shows your balance. WIN shows the win of the current round.')}</li>
	</ul>

	<h2>{t('DISCLAIMER')}</h2>
	<p class="disclaimer">{t('DISCLAIMER_TEXT')}</p>
</div>

<style lang="scss">
	@use './info.scss';

	.rules {
		margin: 0;
		padding-inline-start: 1.2rem;
	}

	.disclaimer {
		font-size: 0.8rem;
		opacity: 0.85;
	}
</style>
