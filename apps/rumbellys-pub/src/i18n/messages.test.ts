import { describe, expect, it } from 'vitest';

import ar from './messages/ar';
import da from './messages/da';
import de from './messages/de';
import en from './messages/en';
import es from './messages/es';
import fi from './messages/fi';
import fr from './messages/fr';
import hi from './messages/hi';
import id from './messages/id';
import ja from './messages/ja';
import ko from './messages/ko';
import pl from './messages/pl';
import pt from './messages/pt';
import ru from './messages/ru';
import tr from './messages/tr';
import vi from './messages/vi';
import zh from './messages/zh';
import sweepsEn from './messages/sweeps_en';

const languages: [string, Record<string, string>][] = Object.entries({
	ar, da, de, en, es, fi, fr, hi, id, ja, ko, pl, pt, ru, tr, vi, zh,
});

// Engine "Jurisdiction requirements": terms that must not appear in social mode (stake.us).
const RESTRICTED =
	/\b(bet\w*|rebet|wager\w*|stake\w*|buy\w*|bought|purchas\w*|pay\w*|paid|cash|money|credit\w*|currenc\w*|deposit\w*|fund\w*|gambl\w*|withdraw\w*|at the cost of|cost of)\b/i;

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

describe('game messages', () => {
	it.each(languages)('%s has exactly the English keys', (_: string, messages: Record<string, string>) => {
		expect(Object.keys(messages).sort()).toEqual(Object.keys(en).sort());
	});

	it.each(languages)('%s has no empty texts', (_: string, messages: Record<string, string>) => {
		for (const [key, text] of Object.entries(messages)) {
			expect(text.trim(), key).not.toBe('');
		}
	});

	it.each(languages)('%s keeps every placeholder', (_: string, messages: Record<string, string>) => {
		for (const [key, text] of Object.entries(messages)) {
			expect(placeholders(text), key).toEqual(placeholders(key));
		}
	});
});

describe('social mode (sweeps_en)', () => {
	const social: Record<string, string> = { ...en, ...sweepsEn };

	it('only overrides existing keys', () => {
		for (const key of Object.keys(sweepsEn)) expect(en).toHaveProperty(key);
	});

	it('shows no restricted gambling terms', () => {
		const offending = Object.values(social).filter((text) => RESTRICTED.test(text));
		expect(offending).toEqual([]);
	});
});
