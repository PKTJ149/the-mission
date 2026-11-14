"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img>, often without alt */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChipCloseIcon, cx, DropdownSearchIcon } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";

// The mission pages' CustomDropdown variants. They differ from the shared <CustomDropdown> in the
// toggler (an <img> arrow, .dropdown-toggler-mission) and in where .custom-dropdown sits, so they are
// rebuilt here on the shared positioning hook (gap reported to the shell owner).

const ARROW = "/assets/images/mission/icon-arrow-down.png";

export type MissionDropdownItem = {
  value: string;
  label: ReactNode;
  chip?: string; // data-chip
  i18nKey?: string; // data-i18n on the item (items with class "mission-page")
};

type WrapperDropdownProps = {
  id?: string;
  className?: string; // extra classes after "custom-dropdown-wrapper custom-input dropdown-wrapper"
  items: MissionDropdownItem[];
  placeholder: ReactNode;
  search?: boolean;
  nested?: boolean; // .custom-dropdown inside its own .dropdown-wrapper (member type dropdown)
  invalid?: boolean;
  disabled?: boolean;
  dataValue?: string; // data-value on the wrapper
  bodyId?: string; // id of .custom-dropdown-body (captured: "agent-dropdown-body", also on the member-group list)
  children?: ReactNode; // e.g. the .invalid-feedback
} & (
  | { multiple?: false; value: string | null; onChange: (value: string) => void }
  | { multiple: true; value: string[]; onChange: (value: string[]) => void }
);

// div.custom-dropdown-wrapper.custom-input.dropdown-wrapper(.fill|.empty)(.custom-invalid)(.multiple)
// > .dropdown-toggler.dropdown-toggler-mission + .input-fake + .custom-dropdown
export function WrapperDropdown(props: WrapperDropdownProps) {
  const { id, className, items, placeholder, search, nested, invalid, disabled, dataValue, bodyId, children } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fakeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  const [fakeWidth, setFakeWidth] = useState(0);

  const dropdown = useFloatingDropdown({
    anchorRef: fakeRef,
    dropdownRef,
    options: { stretch: true },
    disabled,
    isOwnTarget: (target) =>
      target.closest(".dropdown-toggler-mission")?.parentElement === wrapperRef.current || target.closest(".multiple-item") !== null,
  });

  useEffect(() => {
    if (!props.multiple || !fakeRef.current) return;
    const observer = new ResizeObserver(([entry]) => setFakeWidth(entry.target.clientWidth));
    observer.observe(fakeRef.current);
    return () => observer.disconnect();
  }, [props.multiple]);

  const selected = props.multiple ? props.value : props.value ? [props.value] : [];
  const filled = selected.length > 0;

  const select = (item: MissionDropdownItem) => {
    if (props.multiple) {
      props.onChange(selected.includes(item.value) ? selected.filter((v) => v !== item.value) : [...selected, item.value]);
    } else {
      props.onChange(item.value);
      dropdown.close();
    }
  };

  let fake: ReactNode = placeholder;
  if (filled && !props.multiple) fake = items.find((i) => i.value === props.value)?.label ?? props.value;
  if (filled && props.multiple) {
    const remove = (value: string) => props.onChange(selected.filter((v) => v !== value));
    fake = <Chips selected={selected} items={items} width={fakeWidth} onRemove={remove} />;
  }

  const textOf = (item: MissionDropdownItem) => (typeof item.label === "string" ? item.label : (item.chip ?? item.value));
  const panel = (
    <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
      {search && (
        <div className="custom-dropdown-search">
          <div className="input-group">
            <input
              type="text"
              className="input-search form-control"
              placeholder="Search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value.trim())}
            />
            <button className="btn-search btn sms-btn" type="button">
              <DropdownSearchIcon />
            </button>
          </div>
        </div>
      )}
      <div className="custom-dropdown-body" id={bodyId}>
        {items.map((item) => (
          <div
            key={item.value}
            data-value={item.value}
            data-chip={item.chip}
            className={cx("custom-dropdown-item", item.i18nKey && "mission-page", selected.includes(item.value) && "selected")}
            data-i18n={item.i18nKey}
            style={!keyword || textOf(item).includes(keyword) ? undefined : { display: "none" }}
            onClick={() => select(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      id={id}
      ref={wrapperRef}
      data-value={dataValue}
      className={cx(
        "custom-dropdown-wrapper custom-input dropdown-wrapper",
        className,
        filled ? "fill" : "empty",
        invalid && "custom-invalid",
        props.multiple && "multiple",
        disabled && "disabled",
      )}
    >
      <div className={cx("dropdown-toggler dropdown-toggler-mission", dropdown.show && "toggled")} onClick={dropdown.toggle}>
        <img src={ARROW} width="24" height="24" />
      </div>
      <div ref={fakeRef} className={cx("input-fake", props.multiple ? "multiple" : "single")}>
        {fake}
      </div>
      {nested ? <div className="dropdown-wrapper">{panel}</div> : panel}
      {children}
    </div>
  );
}

const CHIP_FONT = 'normal 12px "Inter", sans-serif';
let measureCanvas: HTMLCanvasElement | null = null;
function textWidth(text: string) {
  measureCanvas ??= document.createElement("canvas");
  const context = measureCanvas.getContext("2d");
  if (!context) return text.length * 7;
  context.font = CHIP_FONT;
  return context.measureText(text).width;
}

// Same chips as the shared CustomDropdown: as many as fit, then a "+N" chip
function Chips({
  selected,
  items,
  width,
  onRemove,
}: {
  selected: string[];
  items: MissionDropdownItem[];
  width: number;
  onRemove: (value: string) => void;
}) {
  const chipText = (value: string) => {
    const item = items.find((i) => i.value === value);
    return item?.chip ?? (typeof item?.label === "string" ? item.label : value);
  };
  const available = width - 30;
  let used = 10;
  let hidden = 0;
  const shown: string[] = [];
  for (const value of selected) {
    const chipWidth = width > 0 ? textWidth(chipText(value)) + 47 : 0;
    if (hidden > 0 || (width > 0 && used + chipWidth > available)) {
      hidden += 1;
      continue;
    }
    used += chipWidth;
    shown.push(value);
  }
  return (
    <>
      {shown.map((value) => (
        <div key={value} className="multiple-item">
          <a
            className="multiple-close"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRemove(value);
            }}
          >
            <ChipCloseIcon />
          </a>
          <span className="multiple-text">{chipText(value)}</span>
        </div>
      ))}
      {hidden > 0 && (
        <div className="multiple-item">
          <span className="multiple-text">+{hidden.toLocaleString()}</span>
        </div>
      )}
    </>
  );
}

type FilterSelectProps = {
  className: string; // hook class, e.g. "dropdownSelectTypeReward"
  items: MissionDropdownItem[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: ReactNode;
  placeholderI18n?: string; // data-i18n of the placeholder .input-fake
  require?: boolean;
  buttonClassName?: string; // extra classes on the button, e.g. "right" (input groups) or "custom-filter-time"
  fakeClassName?: string; // extra classes on .input-fake
  noState?: boolean; // some captured dropdowns never get .fill/.empty
  selectedI18n?: boolean; // keep the item's data-i18n on .input-fake once selected
  children?: ReactNode; // e.g. the .invalid-feedback
};

// div.col-auto.dropdownSelectX(.require)(.fill|.empty) > button.custom-filter (width 100%)
// > .input-fake.single + span.dropdown-toggler, then .dropdown-wrapper > .custom-dropdown
export function FilterSelect({
  className,
  items,
  value,
  onChange,
  placeholder,
  placeholderI18n,
  require,
  buttonClassName,
  fakeClassName,
  noState,
  selectedI18n,
  children,
}: FilterSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdown = useFloatingDropdown({
    anchorRef: buttonRef,
    dropdownRef,
    options: { stretch: true },
    isOwnTarget: (target) => target.closest("button.custom-filter") === buttonRef.current,
  });

  const item = value !== null ? items.find((i) => i.value === value) : undefined;
  const filled = item !== undefined;
  // Captured: only the unit dropdowns ("บาท", "แต้ม" …) keep data-i18n on the selected text
  const fakeI18n = filled ? (selectedI18n ? item.i18nKey : undefined) : placeholderI18n;

  return (
    <div className={cx("col-auto", className, require && "require", !noState && (filled ? "fill" : "empty"))}>
      <button ref={buttonRef} className={cx("custom-filter", buttonClassName)} style={{ width: "100%" }} onClick={dropdown.toggle} type="button">
        <div className={cx("input-fake single", fakeClassName, fakeI18n && "mission-page")} data-i18n={fakeI18n}>
          {filled ? item.label : placeholder}
        </div>
        <span className={cx("dropdown-toggler", dropdown.show && "toggled")}>
          <img src={ARROW} width="24" height="24" />
        </span>
      </button>
      <div className="dropdown-wrapper">
        <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
          <div className="custom-dropdown-body">
            {items.map((option) => (
              <div
                key={option.value}
                data-value={option.value}
                data-chip={option.chip}
                className={cx("custom-dropdown-item", option.i18nKey && "mission-page", option.value === value && "selected")}
                data-i18n={option.i18nKey}
                onClick={() => {
                  onChange(option.value);
                  dropdown.close();
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// div.col-auto > button.custom-filter with a fixed unit text and no dropdown ("บาท", "วัน" …)
export function StaticFilter({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <div className="col-auto">
      <button className={cx("custom-filter", side)} style={{ width: "100%" }} type="button">
        {children}
      </button>
    </div>
  );
}
