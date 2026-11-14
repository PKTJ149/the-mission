// Looks up i18next-style dot keys, e.g. "missionPage.js.confirm"
// → dictionary.missionPage.js.confirm (same key format as the original data-i18n="...").

export type Dictionary = { [key: string]: string | Dictionary };

const cache = new Map<string, Promise<Dictionary>>();

// Loads /locales/{lang}.json once and reuses it afterwards
export function loadDictionary(lang: string): Promise<Dictionary> {
  let request = cache.get(lang);
  if (!request) {
    request = fetch(`/locales/${lang}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load /locales/${lang}.json (${res.status})`);
        return res.text();
      })
      // The original files start with an invisible BOM character, which JSON.parse rejects
      .then((text) => JSON.parse(text.replace(/^﻿/, "")) as Dictionary);
    cache.set(lang, request);
    request.catch(() => cache.delete(lang)); // allow a retry next time
  }
  return request;
}

// Missing key → returns the key itself, like i18next does on the original site.
// While the file is still loading → returns the fallback (or "") so keys don't flash.
export function translate(dictionary: Dictionary | undefined, key: string, fallback?: string): string {
  if (!dictionary) return fallback ?? "";

  let value: string | Dictionary | undefined = dictionary;
  for (const part of key.split(".")) {
    if (typeof value !== "object") return fallback ?? key;
    value = value[part];
  }
  return typeof value === "string" ? value : (fallback ?? key);
}
