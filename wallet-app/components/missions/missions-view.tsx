"use client";

import { useEffect, useId, useState } from "react";
import { missions, type Mission, type MissionFilter, type MissionSection } from "@/lib/mission-data";
import { useMobileZoom } from "@/lib/use-mobile-zoom";
import { DesktopMissionHeader } from "./desktop-mission-header";
import { FilterTabs } from "./filter-tabs";
import { HistoryPanel } from "./history-panel";
import { DesktopHistoryPanel } from "./history-panel-desktop";
import { MissionBanner } from "./mission-banner";
import { MissionCard } from "./mission-card";
import { MissionHeader } from "./mission-header";
import { RedeemPanel } from "./redeem-panel";
import { DesktopRedeemPanel } from "./redeem-panel-desktop";
import { SearchField } from "./search-field";
import { SectionTabs } from "./section-tabs";

// Seconds since the page opened — drives every countdown with one timer
function useElapsedSeconds() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return elapsed;
}

type Flags = Record<string, { pinned: boolean; favorite: boolean }>;

// Content of the "ประวัติรับรางวัล" and "แลกรางวัล" tabs
function SectionPanel({ section, variant }: { section: Exclude<MissionSection, "missions">; variant: "mobile" | "desktop" }) {
  if (variant === "desktop") return section === "history" ? <DesktopHistoryPanel /> : <DesktopRedeemPanel />;
  return section === "history" ? <HistoryPanel /> : <RedeemPanel />;
}

function EmptyState({ query }: { query: string }) {
  return (
    <p className="py-[64px] text-center text-[14px]/[23px] text-grey-text">
      {query ? `ไม่พบภารกิจที่ตรงกับ “${query}”` : "ยังไม่มีภารกิจในหมวดนี้"}
    </p>
  );
}

export function MissionsView() {
  const baseId = useId();
  const [section, setSection] = useState<MissionSection>("missions");
  const [filter, setFilter] = useState<MissionFilter>("all");
  const [query, setQuery] = useState("");
  const [flags, setFlags] = useState<Flags>(() =>
    Object.fromEntries(missions.map((m) => [m.id, { pinned: m.pinned, favorite: m.favorite }])),
  );
  const elapsed = useElapsedSeconds();
  const zoom = useMobileZoom();

  const toggle = (id: string, key: "pinned" | "favorite") =>
    setFlags((current) => ({ ...current, [id]: { ...current[id], [key]: !current[id][key] } }));

  const search = query.trim();
  const visible = missions.filter((mission) => {
    if (filter === "pinned" && !flags[mission.id].pinned) return false;
    if (filter === "favorite" && !flags[mission.id].favorite) return false;
    if (filter === "new" && !mission.isNew) return false;
    return !search || mission.title.includes(search);
  });

  const renderCard = (mission: Mission) => {
    // Finished missions keep showing the time they ended with; active ones tick down
    const secondsLeft =
      mission.secondsLeft === undefined
        ? undefined
        : mission.status === "active"
          ? Math.max(0, mission.secondsLeft - elapsed)
          : mission.secondsLeft;
    return (
      <MissionCard
        mission={mission}
        pinned={flags[mission.id].pinned}
        favorite={flags[mission.id].favorite}
        secondsLeft={secondsLeft}
        onTogglePin={() => toggle(mission.id, "pinned")}
        onToggleFavorite={() => toggle(mission.id, "favorite")}
      />
    );
  };

  return (
    <>
      {/* ---------- Mobile (Figma "Mission Home Page", 430px) — hidden from 1024px up ---------- */}
      {/* overflow-clip trims the tilted card frames at the screen edge, like the Figma frame does */}
      <div className="mx-auto min-h-dvh w-[430px] overflow-clip bg-page lg:hidden" style={{ zoom }}>
        <MissionHeader backHref="/" backLabel="กลับไปหน้ากระเป๋า" />

        <h1 className="sr-only">ภารกิจ</h1>
        <SectionTabs
          variant="mobile"
          value={section}
          onChange={setSection}
          idPrefix={`${baseId}-m`}
          className="ml-[16px] w-[397px]"
        />

        <div role="tabpanel" id={`${baseId}-m-panel`} aria-labelledby={`${baseId}-m-tab-${section}`}>
          {section === "missions" ? (
            <>
              <MissionBanner variant="mobile" className="mx-[20px] mt-[10px]" />
              <div className="relative mt-[16px] h-[73px]">
                <FilterTabs
                  value={filter}
                  onChange={setFilter}
                  className="absolute top-[17px] left-[calc(50%+0.5px)] -translate-x-1/2"
                />
              </div>

              <div className="mx-[16px] mt-[16px] flex flex-col gap-[16px] pb-[28px]">
                {visible.length === 0 && <EmptyState query={search} />}
                {visible.map((mission) => (
                  <div key={mission.id}>{renderCard(mission)}</div>
                ))}
              </div>
            </>
          ) : (
            <SectionPanel section={section} variant="mobile" />
          )}
        </div>
      </div>

      {/* ---------- Desktop (Figma "Desktop - 3", 1440px) — shown from 1024px up ---------- */}
      <div className="hidden min-h-dvh overflow-clip bg-page lg:block">
        <DesktopMissionHeader backHref="/" backLabel="กลับไปก่อนหน้า" title="ภารกิจ" />

        {/* 3 columns at 1280px+ (as in Figma); 2 columns between 1024 and 1279px */}
        <main className="mx-auto w-full max-w-[816px] pb-[64px] xl:max-w-[1234px]">
          {/* Figma's tab bar is 2px wider than the card grid */}
          <SectionTabs
            variant="desktop"
            value={section}
            onChange={setSection}
            idPrefix={`${baseId}-d`}
            className="mt-[16px] xl:-mx-px"
          />

          <div role="tabpanel" id={`${baseId}-d-panel`} aria-labelledby={`${baseId}-d-tab-${section}`}>
            {section === "missions" ? (
              <>
                <MissionBanner variant="desktop" className="mt-[16px]" />

                <div className="mt-[27px] flex flex-wrap items-center justify-center gap-x-[9px] gap-y-[16px]">
                  <FilterTabs variant="desktop" value={filter} onChange={setFilter} className="w-[502px] px-[24px]" />
                  <SearchField value={query} onChange={setQuery} className="w-[295px]" />
                </div>

                {visible.length === 0 ? (
                  <EmptyState query={search} />
                ) : (
                  <div className="mt-[41px] grid grid-cols-[repeat(2,398px)] justify-center gap-x-[20px] gap-y-[16px] xl:grid-cols-[repeat(3,398px)]">
                    {visible.map((mission) => (
                      <div key={mission.id}>{renderCard(mission)}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <SectionPanel section={section} variant="desktop" />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
