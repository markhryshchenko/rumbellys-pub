import { stateMeta, stateMetaDerived } from 'state-shared';

export const stateBonus = $state({
	selectedBetModeKey: 'BASE',
});

export const stateBonusDerived = {
	// Games with a single bought feature open the confirm dialog directly (no mode cards), so an
	// unselected or non-purchasable key falls back to the first "buy" mode.
	selectedBetModeData: () => {
		const selected = stateMeta.betModeMeta[stateBonus.selectedBetModeKey];
		if (selected && selected.type !== 'default') return selected;
		return stateMetaDerived.betModeMetaList().find((mode) => mode.type === 'buy') ?? selected;
	},
};
