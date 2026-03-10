import { defineStore } from 'pinia';
import { getFontFamilyString } from '@/lib/themes';

export type ThemeId = string;

export const useAppearanceStore = defineStore('appearance', {
  state: () => ({
    theme: 'default' as ThemeId,
    font: 'Rajdhani',
  }),
  actions: {
    setTheme(theme: ThemeId) {
      this.theme = theme;
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    },
    setFont(font: string) {
      this.font = font;
      if (typeof document !== 'undefined') {
        const fontFamily = getFontFamilyString(font);
        document.documentElement.style.setProperty('--app-font', fontFamily);
      }
    },
  },
});
