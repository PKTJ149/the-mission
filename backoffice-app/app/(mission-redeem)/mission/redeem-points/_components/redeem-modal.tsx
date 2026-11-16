"use client";

import { useState } from "react";
import { cx, GoogleDropdown, SystemPopup, useCustomPopupAlert, useSystemPopup, type DropdownItem } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getMemberPoints, redeemPoints, searchCustomers, type Customer } from "@/lib/api/mission-reports";

type RedeemModalProps = {
  control: ReturnType<typeof useSystemPopup>;
  onSaved: () => void; // reload the history table
};

type CustomerItem = DropdownItem & { customer: Customer };

const REQUIRED = "โปรดกรอกข้อมูล"; // Form.inputValidationText 'required' (helper.js)

// #redeemModal (.system-popup.redeem-point-modal) — "แลกรางวัล". Markup as captured in page.html;
// behaviour from the page script read on staging (15/11/2026): validateRedeem(), confirmRedeemPoint().
export function RedeemModal({ control, onSaved }: RedeemModalProps) {
  const t = useT();
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert(); // customSwal
  const [resultAlert, resultAlertHolder] = useCustomPopupAlert(); // substitutionSwal
  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [customerPoints, setCustomerPoints] = useState<number | null>(null);
  const [points, setPoints] = useState("");
  const [reward, setReward] = useState("");
  // Error texts as Form.checkInputWithError / setInputWithError write them ("" = no error)
  const [customerError, setCustomerError] = useState("");
  const [pointsError, setPointsError] = useState("");

  // onSelect: GET /mission/get-point-by-memberId/<memberId>, then "<n> แต้ม" under the label
  const pickCustomer = async (item: DropdownItem | null) => {
    const picked = item as CustomerItem | null;
    setCustomer(picked);
    setCustomerPoints(picked ? await getMemberPoints(picked.customer.memberId ?? picked.customer.id) : null);
  };

  // validateRedeem(): every field is checked; the reward name has no .invalid-feedback, so an empty
  // one shows no message (ORIGINAL) — it only gets the focus.
  const validate = () => {
    let valid = true;
    let focus: string | null = null;
    setCustomerError(customer ? "" : REQUIRED);
    if (!customer) valid = false;
    if (points === "") {
      setPointsError(REQUIRED);
      valid = false;
      focus = "inputRedemptionPoint";
    } else if (customerPoints !== null && Number(points) > customerPoints) {
      setPointsError("จำนวนแต้มที่ใช้แลกมากกว่าแต้มคงเหลือ");
      valid = false;
      focus = "inputRedemptionPoint";
    } else {
      setPointsError("");
    }
    if (reward === "") {
      valid = false;
      focus = "inputRewardName";
    }
    if (focus) document.getElementById(focus)?.focus();
    return valid;
  };

  // resetRedeemPoint()
  const reset = () => {
    setCustomer(null);
    setCustomerPoints(null);
    setPoints("");
    setReward("");
    setCustomerError("");
    setPointsError("");
  };

  // confirmRedeemPoint(): confirm popup, then POST /mission/create-point-exchange (mock: in memory)
  const confirm = async () => {
    if (!validate() || !customer) return;
    const customerName = customer.customer.username || "-";
    const pointExchange = parseInt(points, 10);
    const answer = await popupAlert.show({
      title: "ยืนยันการ ใช้แต้มแลกของรางวัล",
      type: "edit-3",
      message: (
        <>
          คุณกำลังใช้สิทธิ์แลกของรางวัลให้กับยูสเซอร์{" "}
          <span className="redeem-point-reward-wrap">
            <b>{customerName}</b>
            {"      "}จำนวน <b>{pointExchange.toLocaleString()}</b> แต้ม{" "}
          </span>{" "}
          หากกดยืนยันระบบจะทำการลดแต้มที่มีอยู่ให้กับ
          <br /> ยูสเซอร์ทันที คุณต้องการที่จะทำรายการนี้ใช่หรือไม่ ?{" "}
        </>
      ),
      needConfirmation: true,
    });
    if (answer !== "confirmed") return;
    await redeemPoints({ memberId: customer.customer.memberId ?? customer.customer.id, points: pointExchange, reward });
    resultAlert.show({
      title: "ใช้แต้มแลกของรางวัล สำเร็จ !",
      type: "edit-3",
      message: (
        <>
          {" "}
          ระบบได้ทำการลดแต้มเพื่อแลกของรางวัล
          <br /> ให้กับยูสเซอร์สำเร็จแล้ว{" "}
        </>
      ),
      needConfirmation: false,
    });
    reset();
    onSaved();
    control.close();
  };

  return (
    <>
      <SystemPopup
        // ORIGINAL BUG (kept on purpose, PK 15/11/2026): redeemPoint() calls jQuery addClass('show', 'animate-in')
        // and the second class is ignored, so the popup opens without the bounce; the fix would be
        // addClass('show animate-in').
        control={{ ...control, state: control.state.replace(" animate-in", "") }}
        id="redeemModal"
        className="redeem-point-modal"
      >
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
                onSearch={async (keyword) =>
                  (await searchCustomers(keyword)).map((c) => ({ value: c.id, label: `${c.username} : ${c.name}`, customer: c }))
                }
                // Page script: minimumCharecterSearch 3, maxHeight 285, stretch, root: #redeemModalContent
                minimumCharacters={3}
                maxHeight={285}
                stretch
                root={() => document.getElementById("redeemModalContent")}
                invalid={customerError !== ""}
              >
                <div className="invalid-feedback">{customerError}</div>
              </GoogleDropdown>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <label htmlFor="inputRedemptionPoint" className="p2 form-label fw-700 mb-1">
                <span className="mission-page">{t("missionPointsPage.pointsForExchangeAmount", "จำนวนแต้มที่ใช้แลก")}</span>{" "}
                <span className="text-red-50">*</span>
              </label>
              <div
                id="redeemCustomerPoint"
                className="redeem-customer-point-text"
                // jQuery .show() / .hide()
                style={customerPoints === null ? { display: "none" } : undefined}
              >
                {customerPoints === null ? "" : `${customerPoints.toLocaleString()} แต้ม`}
              </div>
            </div>
            <div className={cx("custom-input custom-input-group has-prepend mb-3", pointsError !== "" && "custom-invalid")}>
              <div className="input-wrapper">
                <input
                  id="inputRedemptionPoint"
                  type="text"
                  className="form-control"
                  placeholder="0"
                  value={points}
                  // Form.inputAcceptKey(event, 'integerPositive'): digits only
                  onChange={(event) => setPoints(event.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="text-prepend mission-page">{t("missionPointsPage.points", "แต้ม")}</div>
              <div className="invalid-feedback">{pointsError}</div>
            </div>
            <div className="custom-input mb-3">
              <label htmlFor="inputRewardName" className="p2 form-label fw-700 mb-1">
                <span className="mission-page">{t("missionPointsPage.rewardName", "ชื่อของรางวัล")}</span>{" "}
                <span className="text-red-50">*</span>
              </label>
              <input
                id="inputRewardName"
                type="text"
                className="form-control"
                placeholder="reward name"
                value={reward}
                onChange={(event) => setReward(event.target.value)}
              />
            </div>
            <div className="system-popup-btns confirm">
              {/* cancelRedeemPoint(): ORIGINAL — closes without clearing the fields */}
              <button className="mission-btn-outline system-popup-btn-cancel" onClick={control.close}>
                {t("missionPointsPage.cancel", "ยกเลิก")}
              </button>
              <button id="buttonConfirmRedeemPoint" className="mission-btn system-popup-btn-confirm" onClick={confirm}>
                {t("missionPointsPage.confirm", "ยืนยัน")}
              </button>
            </div>
          </div>
        </div>
      </SystemPopup>
      {popupAlertHolder}
      {resultAlertHolder}
    </>
  );
}
