"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import type { MinigameDetail } from "@/lib/api/minigame-reports";
import { EyeIcon } from "@/app/(minigame-reports)/_components/report-icons";
import type { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";
import { GameStatusBadge } from "./summary-table";

type DetailPanelProps = {
  detail: MinigameDetail | null; // null = summary state (panel hidden)
  onView: () => void; // viewMinigameDetail()
  tooltip: ReturnType<typeof useTooltip>;
};

const HIDDEN: CSSProperties = { display: "none" };
const ROW_GAP: CSSProperties = { rowGap: "1rem" };

// #promotionDetailPanel: the card above the table in the drill-down state (hidden in the summary state).
export function DetailPanel({ detail, onView, tooltip }: DetailPanelProps) {
  const t = useT();

  return (
    <div id="promotionDetailPanel" className="promotion-deposit-card custom-card mb-4" style={detail ? undefined : HIDDEN}>
      <div className="row">
        <div className="col-auto">
          <div className="promotion-deposit-maincard promotion-minigame-maincard h-100">
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="maincard-badge" id="promotionName">
                  {detail?.name}
                </div>
                {/* The condition is CKEditor HTML (it brings its own <p>), inserted like jQuery .html() */}
                <p
                  className="p2 color-emerald-title-1 mt-3 me-2 text-break text-detail-mini-game-custom"
                  id="detailHtml"
                  dangerouslySetInnerHTML={{ __html: detail?.descriptionHtml ?? "" }}
                ></p>
                <div className="flex-fill"></div>
                <div className="d-flex align-items-center me-3">
                  <span className="me-3" id="status-badgeIcon">
                    {detail && <GameStatusBadge status={detail.status} />}
                  </span>
                  <button
                    data-bs-toggle="tooltip"
                    className="system-action action-square action-outline action-info"
                    aria-label="รายละเอียด"
                    data-bs-original-title="รายละเอียด"
                    onMouseEnter={(event) => tooltip.show(event.currentTarget, "รายละเอียด")}
                    onMouseLeave={tooltip.hide}
                    onClick={() => {
                      tooltip.hide();
                      onView();
                    }}
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>
              <div id="overview-image">
                {detail && (
                  <div className="promotion-minigame-wheel-wrapper">
                    <img draggable="false" src={detail.image} />
                  </div>
                )}
              </div>
            </div>
            <div className="promotion-time">
              <p className="p4 mb-0 fw-700">{t("reportPromotionMinigame.promotionPeriod", "ระยะเวลาโปรโมชั่น")}</p>
              <p className="p3 mb-0 fw-700 lh-18 text-color-primary" id="promotionTime">
                {detail?.period}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row gx-3 h-100" style={ROW_GAP}>
            <div className="col-6">
              <div className="promotion-deposit-subcard">
                <div className="subcard-header p2">{t("reportPromotionMinigame.numberOfPromotionGiveaway", "จำนวนการแจกและรับโปร (คน)")}</div>
                <div className="subcard-body">
                  <div className="subcard-row">
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.promotionCustomerCount", "คนที่มีสิทธิ์รับโปร")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="promotionCustomerCount">
                        {detail?.promotionCustomerCount}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2 text-blue-50">{t("reportPromotionMinigame.getPromotionCustomerCount", "คนที่รับสิทธิ์โปรไปแล้ว")}</p>
                      <p className="p1 mb-0 lh-28 fw-700 text-blue-50" id="getPromotionCustomerCount">
                        {detail?.getPromotionCustomerCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="promotion-deposit-subcard orange">
                <div className="subcard-header p2">{t("reportPromotionMinigame.numberOfPromotionPrivilages", "จำนวนการใช้สิทธิ์ (ครั้ง)")}</div>
                <div className="subcard-body">
                  <div className="subcard-row">
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.promotionCount", "มีสิทธิ์ที่ใช้ได้ทั้งหมดกี่ครั้ง")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="promotionCount">
                        {detail?.promotionCount}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2 text-green-50">{t("reportPromotionMinigame.getPromotionCount", "ใช้สิทธิ์ไปแล้วกี่ครั้ง")}</p>
                      <p className="p1 mb-0 lh-28 fw-700 text-green-50" id="getPromotionCount">
                        {detail?.getPromotionCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="promotion-deposit-subcard green">
                <div className="subcard-header p2">
                  {t("reportPromotionMinigame.totalAmountOfBonusGiven", "จำนวนโบนัสแต่ละประเภท ที่ลูกค้าได้รับไปทั้งหมด")}
                </div>
                <div className="subcard-body">
                  <div className="subcard-row">
                    <div className="subcard-col">
                      <p className="subcard-title p2 text-green-50 mb-2">{t("reportPromotionMinigame.creditBonus", "โบนัสเครดิต (฿)")}</p>
                      <p className="p1 mb-0 lh-28 fw-700 text-green-50" id="credit">
                        {detail?.credit}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.minigamePrivilages", "สิทธิ์มินิเกมส์")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="miniGameCount">
                        {detail?.miniGameCount}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.lottoPrivilages", "สิทธิ์แทงหวย")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="lottoCount">
                        {detail?.lottoCount}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.points", "แต้มสะสม")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="pointCount">
                        {detail?.pointCount}
                      </p>
                    </div>
                    <div className="subcard-col">
                      <p className="subcard-title p2 mb-2">{t("reportPromotionMinigame.reward", "ของรางวัล")}</p>
                      <p className="p1 mb-0 lh-28 fw-700" id="rewardCount">
                        {detail?.rewardCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
