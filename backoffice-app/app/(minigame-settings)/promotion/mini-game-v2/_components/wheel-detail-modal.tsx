"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { Fragment } from "react";
import { CustomModal, type useCustomModal } from "@/components/ui";
import type { MiniGameBonusCount, MiniGameSlice, MiniGameSliceBonus } from "@/lib/api/mini-games";

export type WheelDetail = { bonus: MiniGameBonusCount; slice: MiniGameSlice | undefined };

// Texts per bonus type, from getMinigameDetail() (scriptminigame.js:6205)
function bonusTexts(bonus: MiniGameSliceBonus): [string, string] {
  switch (bonus.type) {
    case "credit_fix":
      return ["Credit Fixed Rate", `${bonus.credit} baht`];
    case "credit_percentage":
      return ["Credit Percentage", ""];
    case "point":
      return ["Point", ""];
    case "mini-game":
      return ["Mini game coupon - ", ""];
    case "lotto":
      return ["Lotto coupon", ""];
    case "reward":
      return ["Prize", ""];
  }
}

// #modalShowWheelDetail — opened by a bonus pill on a card (openModalShowWheelDetail).
// The original fills #showModalShowWheelDetail with one row per bonus of slice N.
export function WheelDetailModal({ control, detail, onClose }: { control: ReturnType<typeof useCustomModal>; detail: WheelDetail | null; onClose: () => void }) {
  const bonuses = detail?.slice?.bonuses ?? [];
  const bonus = detail?.bonus;

  return (
    <CustomModal control={control} id="modalShowWheelDetail">
      <img draggable="false" className="modal-banner" src="/assets/images/swal/banner-success.png" />
      <img id="changeStatusAvatar" draggable="false" className="modal-avatar" src="/assets/images/swal/icon-success.png" />
      <div className="modal-inner">
        <h3 id="wheelNumber" className="text-success mb-2">
          {`Wheel ${bonus?.index ?? ""} - จำนวนโบนัสที่แจก`}
        </h3>
        <div className="d-flex flex-wrap flex-lg-no-wrap gap-2" id="showModalShowWheelDetail">
          {bonuses.map((item, x) => {
            const [text1, text2] = bonusTexts(item);
            return (
              <Fragment key={x}>
                <div className="col-12 col-lg-7">
                  <div className="d-flex justify-content-between">
                    <span style={{ color: "#ADADAD" }}>
                      <span>{text1}</span>
                    </span>{" "}
                    <span style={{ width: "50%", textAlign: "end", color: "#6F60C2" }}>
                      <span>{text2}</span>
                    </span>
                  </div>
                </div>
                {x === 0 ? (
                  <div className="col-12 col-lg-4 order-1 order-lg-0">
                    <div className="d-flex justify-content-between justify-content-lg-end gap-0 gap-md-5">
                      <span style={{ color: "#ADADAD" }}>Get Amount</span>{" "}
                      <span style={{ color: "#6F60C2" }}>
                        <div className="wheelCheckLimit">
                          <span>{bonus?.isUnlimited ? "ไม่จำกัด" : `${bonus?.givenOut}/${bonus?.limitAmount}`}</span>
                        </div>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="col-12 col-lg-4"></div>
                )}
              </Fragment>
            );
          })}
        </div>
        <div className="text-center mt-3">
          {/* Width not captured; the screenshot shows the plain btn-a text button */}
          <button type="button" className="btn system-btn btn-a btn-rounded" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
