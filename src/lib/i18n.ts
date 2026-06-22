import { cookies } from 'next/headers';
import { prisma } from './db';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

export const LOCALES = ['ru', 'en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = 'jb_locale';
export const LOCALE_NAMES: Record<Locale, string> = { ru: 'Русский', en: 'English', zh: '中文' };

export type Dict = Record<string, string>;

const BASE: Record<Locale, Dict> = { ru: ru as Dict, en: en as Dict, zh: zh as Dict };

export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value as Locale | undefined;
  return value && LOCALES.includes(value) ? value : 'ru';
}

/** Dictionary = static JSON file + overrides edited in the admin "Translations" section. */
export async function getDict(locale: Locale): Promise<Dict> {
  const dict = { ...BASE[locale] };
  try {
    const overrides = await prisma.translation.findMany({ where: { locale } });
    for (const o of overrides) dict[o.key] = o.value;
  } catch {
    // database not ready yet — fall back to static dictionary
  }
  return dict;
}

export function t(dict: Dict, key: string): string {
  return dict[key] ?? key;
}

/** Picks a localized column from a row, e.g. localized(artwork, 'title', 'en') -> titleEn */
export function localized<T extends Record<string, any>>(row: T, field: string, locale: Locale): string {
  const suffix = locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Zh';
  return (row[`${field}${suffix}`] as string) ?? '';
}

export function dateFormat(date: Date, locale: Locale): string {
  const map: Record<Locale, string> = { ru: 'ru-RU', en: 'en-GB', zh: 'zh-CN' };
  return new Intl.DateTimeFormat(map[locale], { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
