export interface ThemeInfo {
  name: string;
  value: string;
  description: string;
  isDarkTheme: boolean;
}

export const themes: Record<string, ThemeInfo> = {
  default: {
    name: 'Light',
    value: 'light',
    description: 'Classic light theme',
    isDarkTheme: false,
  },
  dark: {
    name: 'Dark',
    value: 'dark',
    description: 'Dark mode theme',
    isDarkTheme: true,
  },
  ocean: {
    name: 'Ocean',
    value: 'ocean',
    description: 'Deep blue ocean theme',
    isDarkTheme: true,
  },
  forest: {
    name: 'Forest',
    value: 'forest',
    description: 'Natural green theme',
    isDarkTheme: true,
  },
  sunset: {
    name: 'Sunset',
    value: 'sunset',
    description: 'Warm orange theme',
    isDarkTheme: true,
  },
  purple: {
    name: 'Purple',
    value: 'purple',
    description: 'Royal purple theme',
    isDarkTheme: true,
  },
  rose: {
    name: 'Rose',
    value: 'rose',
    description: 'Pink/rose theme',
    isDarkTheme: true,
  },
  gray: {
    name: 'Gray',
    value: 'gray',
    description: 'Dark gray theme',
    isDarkTheme: true,
  },
};

export type ThemeId = keyof typeof themes;

export function getThemeInfo(theme: string): ThemeInfo {
  return themes[theme] ?? themes.default;
}

export function getThemeNames(): ThemeId[] {
  return Object.keys(themes) as ThemeId[];
}

export const AVAILABLE_FONTS = [
  'system-ui',
  'Menlo',
  'Fira Code',
  'JetBrains Mono',
  'Source Code Pro',
  'Roboto',
  'Open Sans',
  'Lato',
  'Verdana',
  'Rajdhani',
] as const;

export type FontId = (typeof AVAILABLE_FONTS)[number];

const fontFamilyMap: Record<string, string> = {
  'system-ui':
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  Menlo: 'Menlo, Consolas, "Liberation Mono", Courier, monospace',
  'Fira Code': '"Fira Code", Consolas, "Liberation Mono", Courier, monospace',
  'JetBrains Mono':
    '"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace',
  'Source Code Pro':
    '"Source Code Pro", Consolas, "Liberation Mono", Courier, monospace',
  Roboto: 'Roboto, sans-serif',
  'Open Sans': '"Open Sans", sans-serif',
  Lato: 'Lato, sans-serif',
  Verdana: 'Verdana, sans-serif',
  Rajdhani: 'Rajdhani, sans-serif',
};

export function getFontFamilyString(font: string): string {
  return fontFamilyMap[font] ?? font;
}
