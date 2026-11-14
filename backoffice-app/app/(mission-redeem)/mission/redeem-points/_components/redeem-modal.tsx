"use client";

import { useState } from "react";
import { cx, GoogleDropdown, SystemPopup, useSystemPopup, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getMemberPoints, redeemPoints, searchMembers } from "@/lib/api/mission-reports";

type RedeemModalProps = {
  control: ReturnType<typeof useSystemPopup>;
  onSaved: () => void; // show the feedback + reload the history table
};

// #redeemModal (.system-popup.redeem-point-modal) — "แลกรางวัล". Markup as captured in page.html.
// The page script was not captured: required-field checks and their messages are reconstructed.
export function RedeemModal({ control, onSaved }: RedeemModalProps) {
  const t = useT();
  const [customer, setCustomer] = useState<DropdownItem | null>(null);
  const [customerPoints, setCustomerPoints] = useState<number | null>(null);
  const [points, setPoints] = useState("");
  const [reward, setReward] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const customerInvalid = submitted && !customer;
  const pointsInvalid = submitted && !(Number(points) > 0);
  const rewardInvalid = submitted && !reward.trim();

  const pickCustomer = async (item: DropdownItem | null) => {
    setCustomer(item);
    setCustomerPoints(item ? await getMemberPoints(item.value) : null);
  };

  const reset = () => {
    setCustomer(null);
    setCustomerPoints(null);
    setPoints("");
    setReward("");
    setSubmitted(false);
  };

  // cancelRedeemPoint()
  const cancel = () => {
    control.close();
    reset();
  };

  // confirmRedeemPoint() — mock save, kept in memory only
  const confirm = async () => {
    setSubmitted(true);
    if (!customer || !(Number(points) > 0) || !reward.trim()) return;
    await redeemPoints({ memberId: customer.value, points: Number(points), reward: reward.trim() });
    control.close();
    reset();
    onSaved();
  };

  return (
    <SystemPopup control={control} id="redeemModal" className="redeem-point-modal">
      <div id="redeemModalContent" className="system-popup-content">
        <div className="system-popup-content-header align-items-center">
          <h4 className="mission-page">{t("missionPointsPage.rewardExchange", "แลกรางวัล")}</h4>
        </div>
        <div className="system-popup-content-inner">
          <p className="p1 fw-700 mb-3 mission-page">
            {t("missionPointsPage.rewardExchangeSubText", "สร้างรายการแลกของรางวัลให้กับสมาชิก")}
          </p>
          <div className="mb-3">
            <label htmlFor="inputSelectCustomer" className="p2 form-label fw-700 mb-1">
              <span className="mission-page">{t("missionPointsPage.customerUsername", "ยูสเซอร์ลูกค้า")}</span>:{" "}
              <span className="text-red-50">*</span>
            </label>
            <GoogleDropdown
              id="manualSelectCustomer"
              inputId="inputSelectCustomer"
              value={customer}
              onChange={pickCustomer}
              onSearch={async (keyword) => (await searchMembers(keyword)).map((m) => ({ value: m.id, label: m.username }))}
              invalid={customerInvalid}
            >
              <div className="invalid-feedback">
                {customerInvalid ? t("missionPage.js.usernamePlaceholder2", "ระบุชื่อยูสเซอร์") : ""}
              </div>
            </GoogleDropdown>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <label htmlFor="inputRedemptionPoint" className="p2 form-label fw-700 mb-1">
              <span className="mission-page">{t("missionPointsPage.pointsForExchangeAmount", "จำนวนแต้มที่ใช้แลก")}</span>{" "}
              <span className="text-red-50">*</span>
            </label>
            {/* Shown once a customer is picked; its text format was not captured (guess) */}
            <div
              id="redeemCustomerPoint"
              className="redeem-customer-point-text"
              style={{ display: customerPoints === null ? "none" : "block" }}
            >
              {customerPoints === null ? "" : `${customerPoints.toLocaleString()} ${t("missionPointsPage.points", "แต้ม")}`}
            </div>
          </div>
          <div className={cx("custom-input custom-input-group has-prepend mb-3", pointsInvalid && "custom-invalid")}>
            <div className="input-wrapper">
              <input
                id="inputRedemptionPoint"
                type="text"
                className={cx("form-control", pointsInvalid && "is-invalid")}
                placeholder="0"
                value={points}
                // Form.inputAcceptKey(event, 'integerPositive'): digits only
                onChange={(event) => setPoints(event.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className="text-prepend mission-page">{t("missionPointsPage.points", "แต้ม")}</div>
            <div className="invalid-feedback" style={pointsInvalid ? { display: "block" } : undefined}>
              {pointsInvalid ? t("missionPage.js.errorTextPoints", "กรุณากรอกจำนวนแต้ม") : ""}
            </div>
          </div>
          <div className="custom-input mb-3">
            <label htmlFor="inputRewardName" className="p2 form-label fw-700 mb-1">
              <span className="mission-page">{t("missionPointsPage.rewardName", "ชื่อของรางวัล")}</span>{" "}
              <span className="text-red-50">*</span>
            </label>
            <input
              id="inputRewardName"
              type="text"
              className={cx("form-control", rewardInvalid && "is-invalid")}
              placeholder="reward name"
              value={reward}
              onChange={(event) => setReward(event.target.value)}
            />
          </div>
          <div className="system-popup-btns confirm">
            <button className="mission-btn-outline system-popup-btn-cancel" onClick={cancel}>
              {t("missionPointsPage.cancel", "ยกเลิก")}
            </button>
            <button id="buttonConfirmRedeemPoint" className="mission-btn system-popup-btn-confirm" onClick={confirm}>
              {t("missionPointsPage.confirm", "ยืนยัน")}
            </button>
          </div>
        </div>
      </div>
    </SystemPopup>
  );
}
