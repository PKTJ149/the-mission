"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/components/ui";
import { useFloatingDropdown } from "@/components/ui/use-floating-dropdown";
import { AutoRefreshIcon, NoRefreshIcon, RefreshSettingIcon } from "./report-icons";

const TIMES = [
  { value: 30, label: "30s" },
  { value: 45, label: "45s" },
  { value: 60, label: "60s" },
  { value: 120, label: "120s" },
  { value: 0, label: "ปิดการ Auto Refresh" },
];

// #autoRefreshWrapper + #dropdownAutoRefresh: helper.js ButtonRefreshPlugin on a CustomDropdown.
// Counts down once a second and calls onRefresh at 0; the gear picks 30/45/60/120 s or off.
export function AutoRefresh({ onRefresh }: { onRefresh: () => void }) {
  const [refreshTime, setRefreshTime] = useState(60);
  const [display, setDisplay] = useState(60);
  const [cycle, setCycle] = useState(0); // bumped to restart the countdown
  const timer = useRef(60);
  const latestRefresh = useRef(onRefresh);
  const settingRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const auto = refreshTime !== 0;

  useEffect(() => {
    latestRefresh.current = onRefresh;
  });

  // Original countdownTimer(): show the value, refresh at 0 and start again, then count down
  useEffect(() => {
    if (!auto) return;
    timer.current = refreshTime - 1;
    const interval = setInterval(() => {
      setDisplay(timer.current);
      if (timer.current < 1) {
        timer.current = refreshTime;
        latestRefresh.current();
      }
      timer.current--;
    }, 1000);
    return () => clearInterval(interval);
  }, [auto, refreshTime, cycle]);

  const dropdown = useFloatingDropdown({
    anchorRef: settingRef,
    dropdownRef,
    options: { placement: ["bottom", "right"] },
    isOwnTarget: (target) => target.closest(".refresh-setting") === settingRef.current,
  });

  const restart = (value: number) => {
    setDisplay(value);
    setCycle((count) => count + 1);
  };

  const choose = (value: number) => {
    setRefreshTime(value);
    restart(value);
    dropdown.close();
  };

  const refreshNow = () => {
    if (auto) restart(refreshTime);
    onRefresh();
  };

  return (
    <>
      <div id="autoRefreshWrapper" className="system-btn-group custom-btn-refresh">
        <button className="system-btn refresh-btn" onClick={refreshNow}>
          {auto ? <AutoRefreshIcon /> : <NoRefreshIcon />}{" "}
          <span className="refresh-text">{auto ? "Refresh in" : ""}</span>{" "}
          <span className="refresh-value">{auto ? `${display} sec.` : "Refresh"}</span>
        </button>
        <button
          ref={settingRef}
          className={cx("system-btn btn-icon refresh-setting", dropdown.show && "dropdown-show dropdown-fill")}
          onClick={dropdown.toggle}
        >
          <RefreshSettingIcon />
        </button>
      </div>
      <div id="dropdownAutoRefresh" className="dropdown-wrapper">
        <div ref={dropdownRef} className={cx("custom-dropdown", dropdown.stateClassName)}>
          <div className="custom-dropdown-body">
            {TIMES.map((item) => (
              <div
                key={item.value}
                data-value={item.value}
                className={cx("custom-dropdown-item", item.value === refreshTime && "selected")}
                onClick={() => choose(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
