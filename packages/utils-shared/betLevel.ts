// Default bet from /wallet/authenticate (Engine: bet levels are never hardcoded).
// defaultBetLevel when it is one of the bet levels, otherwise the nearest level.
// Values are in API units (1,000,000 = 1.00).
export const pickDefaultBet = (betLevels: number[], defaultBetLevel?: number) => {
	if (!betLevels.length) return defaultBetLevel ?? 0;
	if (defaultBetLevel === undefined) return betLevels[0];
	return betLevels.reduce((best, level) =>
		Math.abs(level - defaultBetLevel) < Math.abs(best - defaultBetLevel) ? level : best,
	);
};
