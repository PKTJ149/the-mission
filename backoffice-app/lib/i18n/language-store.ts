// Which language the back office shows. Kept in localStorage under the same key
// the original site used ("self-language"), so a saved choice carries over.

export type Lang = "th" | "en";

const STORAGE_KEY = "self-language";
const DEFAULT_LANG: Lang = "th";

const listeners = new Set<() => void>();
// Remembers the choice even when localStorage is blocked (e.g. private mode)
let memoryLang: Lang | null = null;

function isLang(value: unknown): value is Lang {
  return value === "th" || value === "en";
}

export function getLang(): Lang {
  if (memoryLang) return memoryLang;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // localStorage unavailable — fall through to the default
  }
  return DEFAULT_LANG;
}

// The server has no localStorage, so it always renders the default language
export function getServerLang(): Lang {
  return DEFAULT_LANG;
}

export function setLang(lang: Lang) {
  memoryLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Not saved, but memoryLang still switches the language for this visit
  }
  listeners.forEach((notify) => notify());
}

export function subscribeLang(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}
