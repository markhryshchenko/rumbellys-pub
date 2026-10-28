import _ from 'lodash';
import type { Messages } from '@lingui/core';

import type { Language } from 'state-shared';

export type MessagesMap = Record<Language, Messages>;

// Each source may cover only some languages (Engine requires English only; other languages fall back).
export const mergeMessagesMaps = (messagesMapList: Partial<MessagesMap>[]): MessagesMap => {
	const merged = messagesMapList
		.filter(Boolean)
		.reduce<MessagesMap>((acc, current) => _.merge(acc, current), {} as MessagesMap);

	return merged;
};
