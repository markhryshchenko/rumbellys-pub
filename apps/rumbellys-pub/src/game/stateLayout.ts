import { createLayout } from 'utils-layout';

// width / height of static/assets/sprites/background/bg_*.webp
export const BACKGROUND_RATIO = {
	normal: 2560 / 1280,
	portrait: 1440 / 2569,
};

export const { stateLayout, stateLayoutDerived } = createLayout({
	backgroundRatio: BACKGROUND_RATIO,
	mainSizesMap: {
		desktop: { width: 1422, height: 800 },
		tablet: { width: 1000, height: 1000 },
		landscape: { width: 1600, height: 900 },
		// narrow, so the reels (with the thin portrait frame, 676 units) fill the screen width
		portrait: { width: 680, height: 1209 },
	},
});
