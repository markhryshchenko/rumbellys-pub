<script lang="ts">
	import { stateBet, stateI18nDerived } from 'state-shared';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import config from '../../game/config';

	// Paytable values in the math config are multiples of the total bet (9 lines).
	const t = stateI18nDerived.translate;

	const images = import.meta.glob<string>('./symbols/*.webp', {
		eager: true,
		import: 'default',
		query: '?url',
	});
	const image = (symbol: string) => images[`./symbols/${symbol.toLowerCase()}.webp`];

	const ORDER = ['W', 'H1', 'H2', 'H3', 'H4', 'H5', 'L1', 'L2', 'L3', 'L4', 'L5'] as const;

	const payouts = (symbol: (typeof ORDER)[number]) =>
		[5, 4, 3].map((kind) => {
			const entry = config.symbols[symbol].paytable.find((pay) => `${kind}` in pay);
			const multiplier = entry ? Object.values(entry)[0] : 0;
			return { kind, value: numberToCurrencyString(multiplier * stateBet.betAmount) };
		});

	const lines = Object.values(config.paylines);
</script>

<div class="info">
	<h2>{t('SYMBOL PAYOUTS')}</h2>
	<p>{t('Values are shown for the current total bet.')}</p>

	<div class="symbols">
		{#each ORDER as symbol (symbol)}
			<div class="symbol">
				<img src={image(symbol)} alt={symbol} />
				<ul>
					{#each payouts(symbol) as { kind, value } (kind)}
						<li><b>{kind}</b> {value}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="special">
		<img src={image('W')} alt="WILD" />
		<p>{t('WILD substitutes for all symbols except SCATTER.')}</p>
	</div>
	<div class="special">
		<img src={image('S')} alt="SCATTER" />
		<p>{t("SCATTER can land anywhere. 3, 4 or 5 SCATTER symbols start RUMBELLY'S ROUNDS.")}</p>
	</div>

	<h2>{t('WIN LINES')}</h2>
	<p>{t('9 fixed win lines.')}</p>
	<div class="lines">
		{#each lines as rows, index (index)}
			<div class="line">
				<span>{index + 1}</span>
				<div class="grid">
					{#each [0, 1, 2] as row (row)}
						{#each rows as lineRow, reel (reel)}
							<i class:on={lineRow === row}></i>
						{/each}
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<p>{t('Wins count from left to right on adjacent reels, starting from the leftmost reel.')}</p>
	<p>{t('Only the highest win on each line counts. Wins on different lines are added together.')}</p>
</div>

<style lang="scss">
	@use './info.scss';

	.symbols {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		gap: 0.75rem;
		width: 100%;
	}

	.symbol {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		img {
			width: 3.5rem;
			height: 3.5rem;
			object-fit: contain;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			font-size: 0.8rem;
			line-height: 1.35;
		}

		b {
			color: var(--info-accent);
			margin-right: 0.25rem;
		}
	}

	.special {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;

		img {
			width: 3.5rem;
			height: 3.5rem;
			object-fit: contain;
			flex: none;
		}
	}

	.lines {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
		gap: 0.6rem;
		width: 100%;
	}

	.line {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;

		span {
			width: 1rem;
			text-align: right;
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(5, 0.7rem);
		gap: 2px;

		i {
			height: 0.7rem;
			background: rgba(255, 255, 255, 0.15);
			border-radius: 2px;
		}

		i.on {
			background: var(--info-accent);
		}
	}
</style>
