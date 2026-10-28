<script lang="ts" module>
	import type { SpriteProps } from 'pixi-svelte';

	import type { IconName } from '../types';

	export type Props = Omit<SpriteProps, 'key' | 'anchor' | 'width' | 'height' | 'tint'> & {
		name: IconName;
		size: number;
		color?: number;
	};
</script>

<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import { UI_COLORS } from '../constants';

	// White icons from the game's "uiIcons" atlas (art/tools/ui_icons.py); tint recolours them.
	const { name, size, color = UI_COLORS.icon, ...spriteProps }: Props = $props();
</script>

<Sprite {...spriteProps} key={`icon_${name}`} anchor={0.5} width={size} height={size} tint={color} />
