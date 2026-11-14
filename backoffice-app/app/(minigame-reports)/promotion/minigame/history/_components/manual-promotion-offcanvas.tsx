"use client";

import { useState, type CSSProperties } from "react";
import { GoogleDropdown, Offcanvas, OffcanvasCloseIcon, Select2, type DropdownItem, type Select2Option, type useOffcanvas } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { createManualPromotion, getRewardPieces, searchCustomers } from "@/lib/api/minigame-reports";

type ManualPromotionOffcanvasProps = {
  control: ReturnType<typeof useOffcanvas>;
  miniGames: Select2Option[]; // #anyMiniGameId options
  onCreated: () => void; // the page refreshes its table
};

const HIDDEN: CSSProperties = { display: "none" };
// Width of the two footer buttons (inline, not captured) — measured on the screenshot
const BUTTON_STYLE: CSSProperties = { width: "110px" };

// #offcanvasCreateManual — "เพิ่มโปรให้สมาชิก (Manual)". Nothing is sent: confirming adds the row
// to the in-memory history only. The page script (createManual) was not captured, so no dialog is shown.
export function ManualPromotionOffcanvas({ control, miniGames, onCreated }: ManualPromotionOffcanvasProps) {
  const t = useT();
  const [customer, setCustomer] = useState<DropdownItem | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Select2Option[]>([]);
  const [reward, setReward] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const canSubmit = Boolean(customer && gameId && reward);

  const reset = () => {
    setCustomer(null);
    setGameId(null);
    setRewards([]);
    setReward(null);
    setRemark("");
    setDepositAmount("");
  };

  // cancelCreateManual()
  const cancel = () => {
    control.hide();
    reset();
  };

  // The reward list depends on the chosen mini-game
  const chooseGame = async (value: string) => {
    setGameId(value);
    setReward(null);
    setRewards(await getRewardPieces(value));
  };

  // createManual()
  const submit = async () => {
    if (!customer || !gameId || !reward) return;
    await createManualPromotion({
      username: customer.value,
      gameId,
      reward,
      remark,
      depositAmount: depositAmount || "0", // "ถ้าไม่กรอกจะแทนค่าเป็น 0"
    });
    control.hide();
    reset();
    onCreated();
  };

  return (
    <Offcanvas control={control} id="offcanvasCreateManual" className="offcanvas-minigame-custom offcanvas offcanvas-end" data-bs-focus="false">
      <div className="offcanvas-header offcanvas-header-minigame">
        <h4 className="mb-0">{t("reportPromotionMinigameHistory.promotionManual", "เพิ่มโปรให้สมาชิก (Manual)")}</h4>
        <div className="flex-fill"></div>
        <div className="icon-close-offcanvas-minigame-custom" onClick={cancel}>
          <OffcanvasCloseIcon />
        </div>
      </div>
      <div className="offcanvas-body">
        <div className="label-minigame-custom mb-3">
          <span id="textTabsStep2-1-4">{t("reportPromotionMinigameHistory.inputPromotionManual", "ระบุข้อมูลลูกค้าที่ต้องการเพิ่มโปร")}</span>
        </div>
        <div className="row gx-20 gy-3 mb-4">
          <div className="col-6">
            <label htmlFor="inputSelectCustomer" className="p2 form-label fw-700 mb-1">
              <span>{t("reportPromotionMinigameHistory.username", "ยูสเซอร์ลูกค้า:")}</span> <span className="text-red-50">*</span>
            </label>
            <GoogleDropdown
              id="manualSelectCustomer"
              inputId="inputSelectCustomer"
              placeholder={t("reportPromotionMinigameHistory.phSelectCustomer", "พิมพ์ชื่อ ยูสเซอร์เนม หรือเกมยูสเซอร์เนม")}
              value={customer}
              onChange={setCustomer}
              onSearch={searchCustomers}
            >
              <div className="invalid-feedback"></div>
            </GoogleDropdown>
          </div>
          <div className="col-6">
            <div id="manualPromotionCategory" className="custom-input dropdown-wrapper">
              <label htmlFor="anyMiniGameId" className="p2 form-label fw-700 mb-1">
                <span>{t("reportPromotionMinigameHistory.chooseMinigame", "เลือกมินิเกมส์")}</span> <span className="text-red-50">*</span>
              </label>
              <Select2 id="anyMiniGameId" options={miniGames} value={gameId} onChange={chooseGame} />
              <div id="divErrorMiniGame" className="text-danger mt-1 error" style={HIDDEN}></div>
            </div>
          </div>
          <div className="col-6">
            <div id="manualPromotionReward" className="custom-input dropdown-wrapper">
              <label htmlFor="selectRewardPiece" className="p2 form-label fw-700 mb-1">
                <span>{t("reportPromotionMinigameHistory.reward", "รางวัลที่จะเพิ่มให้")}</span> <span className="text-red-50">*</span>
              </label>
              <Select2 id="selectRewardPiece" options={rewards} value={reward} onChange={setReward} />
              <div id="divErrorRewardPiece" className="text-danger mt-1 error" style={HIDDEN}></div>
            </div>
          </div>
          <div className="col-12">
            <div className="custom-input">
              <label htmlFor="manualRemark" className="p2 form-label fw-700 mb-1">
                <span>{t("reportPromotionMinigameHistory.description", "หมายเหตุ")}</span>
              </label>
              <input
                id="manualRemark"
                type="text"
                className="form-control"
                placeholder={t("reportPromotionMinigameHistory.phDescription", "ระบุหมายเหตุ")}
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="custom-input">
              <label htmlFor="depositAmount" className="p2 form-label fw-700 mb-1">
                ยอดฝาก
              </label>
              <input
                id="depositAmount"
                type="number"
                className="form-control mb-2"
                placeholder={t("reportPromotionMinigameHistory.phDepositInp", "ถ้าไม่กรอกจะแทนค่าเป็น 0")}
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
              />
              <small className="form-text text-muted ps-2">
                {t(
                  "reportPromotionMinigameHistory.depositSubText",
                  "ช่องสำหรับกรอกคำนวนโปร (โดยเป็นการกรอกยอดฝาก ไม่เติมให้ลูกค้าจริง โดยจะใช้คำนวนรางวัลและเทิร์นต่างๆ)",
                )}
              </small>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <button className="btn system-btn btn-a btn-rounded" style={BUTTON_STYLE} onClick={cancel}>
            {t("reportPromotionMinigameHistory.cancel", "ยกเลิก")}
          </button>
          <button disabled={!canSubmit} id="buttonCreateManual" className="btn system-btn btn-rounded ms-2" style={BUTTON_STYLE} onClick={submit}>
            {t("reportPromotionMinigameHistory.confirm", "ยืนยัน")}
          </button>
        </div>
      </div>
    </Offcanvas>
  );
}
