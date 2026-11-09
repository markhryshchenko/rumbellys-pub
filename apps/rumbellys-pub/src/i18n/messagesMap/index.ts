import { mergeMessagesMaps } from 'utils-shared/i18n';
import { messagesMap as messagesMapUiPixi } from 'components-ui-pixi';
import { messagesMap as messagesMapUiHtml } from 'components-ui-html';

import ar from '../messages/ar';
import da from '../messages/da';
import de from '../messages/de';
import en from '../messages/en';
import es from '../messages/es';
import fi from '../messages/fi';
import fr from '../messages/fr';
import hi from '../messages/hi';
import id from '../messages/id';
import ja from '../messages/ja';
import ko from '../messages/ko';
import pl from '../messages/pl';
import pt from '../messages/pt';
import ru from '../messages/ru';
import tr from '../messages/tr';
import vi from '../messages/vi';
import zh from '../messages/zh';
import sweepsEn from '../messages/sweeps_en';

// All texts the player sees, in every language the Engine RGS can request.
const messagesMapGame = { ar, da, de, en, es, fi, fr, hi, id, ja, ko, pl, pt, ru, tr, vi, zh };

// later maps win: the game's translations override the UI packages' sample texts
const messagesMap = mergeMessagesMaps([messagesMapUiPixi, messagesMapUiHtml, messagesMapGame]);

export { sweepsEn };
export default messagesMap;
