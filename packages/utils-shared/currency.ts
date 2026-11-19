// Money formatting rules from the Engine review:
// - every currency uses its own number of decimals (USD 2, JPY 0, ...);
// - social coins XSC / XGC are shown as "10.00 SC" / "10.00 GC" (no "$", code after the number);
// - a win below the smallest unit (e.g. 0.004 USD) gets extra decimals, so it never shows as 0.00.

const SOCIAL_CURRENCY_MAP: Record<string, string> = {
	XGC: 'GC',
	XSC: 'SC',
};

const DEFAULT_DIGITS = 2;
const MAX_EXTRA_DIGITS = 4;

const isSocialCurrency = (currency: string) => currency in SOCIAL_CURRENCY_MAP;

// decimals of the currency (ISO 4217): USD 2, JPY 0, KWD 3. Unknown codes use 2.
export const currencyDigits = (currency: string) => {
	if (isSocialCurrency(currency)) return DEFAULT_DIGITS;
	try {
		return (
			new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
				.maximumFractionDigits ?? DEFAULT_DIGITS
		);
	} catch {
		return DEFAULT_DIGITS;
	}
};

// the currency's decimals, more for a non-zero value that would round to zero
export const fractionDigits = (value: number, digits: number) => {
	let result = digits;
	while (
		value !== 0 &&
		result < digits + MAX_EXTRA_DIGITS &&
		Math.round(Math.abs(value) * 10 ** result) === 0
	) {
		result++;
	}
	return result;
};

export const formatCurrency = (value: number, currency: string, locale = 'en') => {
	const digits = fractionDigits(value, currencyDigits(currency));
	const number = { minimumFractionDigits: digits, maximumFractionDigits: digits };

	if (isSocialCurrency(currency)) {
		return `${new Intl.NumberFormat(locale, number).format(value)} ${SOCIAL_CURRENCY_MAP[currency]}`;
	}

	try {
		return new Intl.NumberFormat(locale, { ...number, style: 'currency', currency }).format(value);
	} catch {
		// unknown currency code: plain number with the code after it
		return `${new Intl.NumberFormat(locale, number).format(value)} ${currency}`.trim();
	}
};
