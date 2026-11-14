"use client";

import { useRef, useState, type ComponentType } from "react";
import { useLang, useT, type Lang } from "@/lib/i18n";
import { cx } from "@/components/ui/cx";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { EnglishFlag, ThaiFlag } from "./flag-icons";

const LANGUAGES: { value: Lang; text: string; Flag: ComponentType }[] = [
  { value: "en", text: "ENG", Flag: EnglishFlag },
  { value: "th", text: "THA", Flag: ThaiFlag },
];

// .simplebar-lang (เปลี่ยนภาษา + current flag) and #dropdownLanguageSidebar.
// Original: CustomDropdown('#dropdownLanguageSidebar', { single, stretch, auto, horizontal: false,
// targetRoot: #toggleLanguageSidebar }) — so it opens above the toggle, as wide as the toggle.
// The toggle shows the selected item's content; picking one calls setLang (saved in localStorage).
export function LanguageSwitcher() {
  const t = useT();
  const { lang, setLang } = useLang();
  const toggleRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // The original only adds "dropdown-fill" to the toggle once the dropdown has been used
  const [used, setUsed] = useState(false);

  const dropdown = useFloatingDropdown({
    anchorRef: toggleRef,
    dropdownRef,
    options: { stretch: true, auto: true, horizontal: false },
    isOwnTarget: (target) => toggleRef.current?.contains(target) ?? false,
  });

  const current = LANGUAGES.find((item) => item.value === lang) ?? LANGUAGES[1];

  return (
    <>
      <div className="simplebar-lang">
        <div className="simplebar-lang-title">{t("sms.changeLanguage", "เปลี่ยนภาษา")}</div>

        <div
          id="toggleLanguageSidebar"
          ref={toggleRef}
          className={cx("simplebar-lang-wrapper", dropdown.show && "dropdown-show", used && "dropdown-fill")}
          onClick={() => {
            setUsed(true);
            dropdown.toggle();
          }}
        >
          <div className="simplebar-lang-text">{current.text}</div>
          {current.value === "en" ? <EnglishFlag /> : <ThaiFlag />}
        </div>
      </div>

      <div id="dropdownLanguageSidebar" className="dropdown-wrapper">
        <div ref={dropdownRef} className={cx("custom-dropdown simplebar-lang-dropdown", dropdown.stateClassName)}>
          {LANGUAGES.map(({ value, text, Flag }) => (
            <div
              key={value}
              data-value={value}
              className={cx("custom-dropdown-item simplebar-lang-wrapper", value === lang && "selected")}
              onClick={() => {
                setLang(value);
                dropdown.close();
              }}
            >
              <div className="simplebar-lang-text">{text}</div>
              <Flag />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
