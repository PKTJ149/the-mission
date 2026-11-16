"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { Fragment, useRef, useState, type CSSProperties, type DragEvent } from "react";
import { ToggleSwitch, cx } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Agent, MiniGame, MiniGameBonusCount } from "@/lib/api/mini-games";
import { BsTooltip } from "./detail-tooltip";
import { EyeIcon } from "./minigame-icons";

type MiniGameCardProps = {
  game: MiniGame;
  agents: Agent[];
  loadingDetail: boolean; // eye button shows a spinner while the detail "loads"
  dragging: boolean;
  onView: (game: MiniGame) => void;
  onBonusClick: (game: MiniGame, bonus: MiniGameBonusCount) => void;
  onToggleStatus: (game: MiniGame, checked: boolean) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

// Measured on staging: click on the eye → the "detail" tooltip shows again this much later
const TOOLTIP_RESHOW_MS = 220;

// One server-rendered card of #customMinigameDraggable (markup from page.html)
export function MiniGameCard({ game, agents, loadingDetail, dragging, onView, onBonusClick, onToggleStatus, onDragStart, onDragEnd }: MiniGameCardProps) {
  const t = useT();
  const eyeRef = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipStuck = useRef(false); // see the ORIGINAL BUG note on the eye button
  const isWheel = game.type === "lucky-wheel";
  const isOn = game.status === "active";
  const agentNames = game.agentIds.map((id) => agents.find((agent) => agent.value === id)?.label ?? id);

  return (
    <div
      className={cx("menu-item card-minigame ", dragging && "dragging")}
      data-draggable-id={game.id}
      data-minigame-id={game.id}
      data-expiry-date=""
      data-type={game.type}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="minigame-menu-dragger">
        <img src="/assets/images/minigame/dragger-icon.svg" />
      </div>
      <div className="d-flex flex-column w-100 gap-3">
        <div className="d-flex flex-wrap gap-3">
          <div className="minigame-col-1">
            <div className="header-minigame">
              {isWheel ? (
                <div className="type-minigame  type-luckywheel">
                  <img src="/assets/images/minigame/wheel-icon.svg" />
                  <span>วงล้อนำโชค</span>
                </div>
              ) : (
                <div className="type-minigame ">
                  <img src="/assets/images/minigame/minigame-other-icon.svg" />
                  <span>เกมส์อื่น ๆ</span>
                </div>
              )}
              {isOn ? (
                <div className="status-minigame minigame-on mb-0">
                  <img src="/assets/images/minigame/switch-on.svg" />
                  <span data-i18n="minigameListTable.text1">{t("minigameListTable.text1", "เปิดใช้งาน")}</span>
                </div>
              ) : (
                // Not captured (no inactive mini-games on staging): mirrors the "on" chip
                <div className="status-minigame minigame-off mb-0">
                  <img src="/assets/images/minigame/switch-off.svg" />
                  <span data-i18n="minigameListTable.text2">{t("minigameListTable.text2", "ปิดใช้งาน")}</span>
                </div>
              )}
            </div>
            <div className="thumbnail-minigame">
              {game.wheel ? (
                <div className="wheel-wrapper">
                  <div className={`custom-wheel wheel-${game.wheel.slices.length}`}>
                    <div className="wheel-item-all">
                      {game.wheel.slices.map((src, i) => (
                        <div key={i} className="wheel-item" style={{ "--item": String(i + 1) } as CSSProperties}>
                          <div className="wheel-image">
                            <img src={src} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="wheel-spin">
                    <img src={game.wheel.spin} />
                  </div>
                  <div className="wheel-frame">
                    <img src={game.wheel.frame} />
                  </div>
                </div>
              ) : (
                <img className="cover-minigame" src={game.cover ?? undefined} />
              )}
            </div>
            <div className="data-minigame">
              <span className="label" data-i18n="minigameListTable.text4">{t("minigameListTable.text4", "ระยะเวลา :-")}</span>
              <div className="title-minigame">
                <span>{game.name}</span>
              </div>
              <div className="date-update">
                <span className="label" data-i18n="minigameListTable.text5">{t("minigameListTable.text5", "สร้างเมื่อ :")}</span>
                <span className="date-2">{game.createdAt}</span>
                <span className="system-badge badge-primary">{game.createdBy}</span>{" "}
                <span className="label" data-i18n="minigameListTable.text6">{t("minigameListTable.text6", "อัพเดตล่าสุดเมื่อ :")}</span>
                <span className="date-2">{game.updatedAt}</span>
                <span className="system-badge badge-secondary">{game.updatedBy}</span>
              </div>
            </div>
          </div>
          <div className="minigame-col-2 ps-3">
            <div className="header-minigame-bonus">
              <span data-i18n="minigameListTable.text7">{t("minigameListTable.text7", "จำนวนโบนัสที่แจกไปในแต่ละชิ้น")}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  ref={eyeRef}
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  className="system-action action-square action-outline action-info me-2"
                  aria-label="detail"
                  data-bs-original-title="detail"
                  disabled={loadingDetail}
                  onMouseEnter={() => {
                    tooltipStuck.current = false;
                    setTooltipOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (!tooltipStuck.current) setTooltipOpen(false);
                  }}
                  onClick={() => {
                    // viewMinigameDetail() hides the tooltip, then swaps the icon for a spinner.
                    setTooltipOpen(false);
                    onView(game);
                    // ORIGINAL BUG (kept on purpose, PK 15/11/2026): on staging the swap under the
                    // pointer makes Bootstrap show the "detail" tooltip again ~220 ms later, and it
                    // stays on screen (above the offcanvas, and after it closes) until the pointer
                    // enters and leaves the eye button again. The fix would be to keep it hidden.
                    setTimeout(() => {
                      if (!eyeRef.current?.matches(":hover")) return;
                      tooltipStuck.current = true;
                      setTooltipOpen(true);
                    }, TOOLTIP_RESHOW_MS);
                  }}
                >
                  {loadingDetail ? (
                    <span className="spinner-border flex-shrink-0" style={{ width: "15px", height: "15px", fontSize: "10px" }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                  ) : (
                    <EyeIcon />
                  )}
                </button>
                <BsTooltip anchorRef={eyeRef} open={tooltipOpen}>
                  detail
                </BsTooltip>
                <ToggleSwitch inputClassName="status-minigame-checkbox" checked={isOn} onChange={(checked) => onToggleStatus(game, checked)} />
              </div>
            </div>
            <div className="minigame-bonus-col">
              {game.bonusCounts.map((bonus) => (
                <div key={bonus.index} className="cursor-pointer data-value-bonus " onClick={() => onBonusClick(game, bonus)}>
                  <div className="data-index">{bonus.index}</div>
                  <span className="value-given-out">{bonus.givenOut}</span>
                  {/* Non-breaking spaces, like the original: plain spaces collapse inside this flex row */}
                  {"\u00a0/\u00a0"}
                  {bonus.isUnlimited ? (
                    <img src="/assets/images/minigame/nolimit.png" width="24" height="24" />
                  ) : (
                    // Limited slices were not captured; the original prints the limit after the slash
                    <span>{bonus.limitAmount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex flex-wrap align-items-center gap-2 px-3">
            <div className="text-white me-3" data-i18n="minigameListTable.text8">{t("minigameListTable.text8", "Agent ที่ใช้งานอยู่")}</div>
            <div className="text-center">
              {agentNames.map((name, i) => (
                <Fragment key={name}>
                  {i > 0 && " "}
                  <span className="custom-badge bg-green-10">{name}</span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
