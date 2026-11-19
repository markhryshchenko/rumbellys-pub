import { describe, expect, it } from 'vitest';

import { currencyDigits, formatCurrency } from 'utils-shared/currency';
import { pickDefaultBet } from 'utils-shared/betLevel';

// Engine review: currency decimals, social coins, sub-cent wins, default bet from authenticate
describe('formatCurrency', () => {
	it('uses the decimals of the currency', () => {
		expect(formatCurrency(1, 'USD')).toBe('$1.00');
		expect(formatCurrency(1234.5, 'EUR')).toBe('€1,234.50');
		expect(formatCurrency(100, 'JPY')).toBe('¥100');
		expect(currencyDigits('JPY')).toBe(0);
		expect(currencyDigits('MXN')).toBe(2);
	});

	it('shows social coins after the number, without "$"', () => {
		expect(formatCurrency(10, 'XSC')).toBe('10.00 SC');
		expect(formatCurrency(2500, 'XGC')).toBe('2,500.00 GC');
	});

	it('adds decimals for wins below the smallest unit', () => {
		expect(formatCurrency(0.004, 'USD')).toBe('$0.004');
		expect(formatCurrency(0.00012, 'XSC')).toBe('0.0001 SC');
		expect(formatCurrency(0.4, 'JPY')).toBe('¥0.4');
		expect(formatCurrency(0, 'USD')).toBe('$0.00');
	});

	it('does not throw on an invalid currency code', () => {
		expect(formatCurrency(1, 'invalid')).toBe('1.00 invalid');
	});
});

describe('pickDefaultBet', () => {
	const levels = [100_000, 200_000, 1_000_000, 5_000_000];

	it('uses defaultBetLevel when it is a bet level', () => {
		expect(pickDefaultBet(levels, 1_000_000)).toBe(1_000_000);
	});

	it('uses the nearest level otherwise', () => {
		expect(pickDefaultBet(levels, 900_000)).toBe(1_000_000);
		expect(pickDefaultBet(levels, 150_000)).toBe(100_000);
	});

	it('uses the smallest level without defaultBetLevel', () => {
		expect(pickDefaultBet(levels)).toBe(100_000);
	});
});
