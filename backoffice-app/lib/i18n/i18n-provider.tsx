"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { getLang, getServerLang, setLang, subscribeLang, type Lang } from "./language-store";
import { loadDictionary, translate, type Dictionary } from "./translate";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, getLang, getServerLang);
  const [dictionaries, setDictionaries] = useState<Partial<Record<Lang, Dictionary>>>({});

  // Fetch the language file whenever the language changes (cached after the first time)
  useEffect(() => {
    let active = true;
    loadDictionary(lang)
      .then((dictionary) => {
        if (active) setDictionaries((prev) => ({ ...prev, [lang]: dictionary }));
      })
      .catch((error) => console.error(error));
    return () => {
      active = false;
    };
  }, [lang]);

  const dictionary = dictionaries[lang];
  const value: I18nValue = {
    lang,
    setLang,
    t: (key, fallback) => translate(dictionary, key, fallback),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useT/useLang must be used inside <I18nProvider>");
  return value;
}

// const t = useT();  t("minigameSetting.bonusType")
export function useT() {
  return useI18n().t;
}

// const { lang, setLang } = useLang();  — for the future THA/ENG switch
export function useLang() {
  const { lang, setLang } = useI18n();
  return { lang, setLang };
}
