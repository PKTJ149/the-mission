"use client";

import { useRef } from "react";
import { SearchClearIcon, SearchIcon } from "./icons";

type SearchInputProps = {
  id?: string; // e.g. "minigameSearch", "tableSearch"
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void; // every keystroke
  onSearch?: (value: string) => void; // Enter, like table.js setSearchInput
  clearId?: string; // id of the × icon, e.g. "clearValuePromotionSearch"
  clearable?: boolean; // show the × (.navigate-close) — CSS reveals it once there is text
};

// .custom-input with the magnifier in .float-prepend (and the optional × that clears it).
// Uncontrolled like the original input; pass key={...} to reset it from outside.
export function SearchInput({ id, placeholder, defaultValue, onChange, onSearch, clearId, clearable = true }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    // CustomInput.clearValue only empties the field; it does not search again
    if (inputRef.current) inputRef.current.value = "";
    onChange?.("");
  };

  return (
    <div className="custom-input">
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="form-control"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyUp={(event) => {
          if (event.key === "Enter") onSearch?.(event.currentTarget.value);
        }}
      />
      <div className="float-prepend">
        <SearchIcon />
        {clearable && <SearchClearIcon id={clearId} onClick={clear} />}
      </div>
    </div>
  );
}
