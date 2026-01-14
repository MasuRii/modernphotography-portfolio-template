import en from '../i18n/en.json';

export const defaultLang = 'en';

export const ui = {
  en,
} as const;

export type UI = typeof ui;
export type Lang = keyof UI;

/**
 * Get the language from the URL
 * @param url The URL object
 * @returns The language code (e.g., 'en')
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/**
 * Hook to get translation function for a specific language
 * @param lang The language code
 * @returns A translation function t(key)
 */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = ui[lang];

    for (const k of keys) {
      if (current === undefined || current === null) return key;
      current = current[k];
    }

    return typeof current === 'string' ? current : key;
  };
}
