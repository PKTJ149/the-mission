"use client";
/* eslint-disable @next/next/no-img-element -- original markup uses plain <img> */

import { useState, type ReactNode } from "react";
import {
  ColorPicker,
  CustomDropdown,
  CustomModal,
  DateRangeFilter,
  EmptyState,
  FilterDropdown,
  GoogleDropdown,
  OffcanvasCloseIcon,
  Offcanvas,
  Pagination,
  RichTextEditor,
  SearchInput,
  Select2,
  StatusFilterIcon,
  SystemPopup,
  TableLoading,
  ToggleSwitch,
  useCustomModal,
  useCustomPopupAlert,
  useCustomSweetAlert,
  useOffcanvas,
  useSystemPopup,
  useToast,
  type DropdownItem,
} from "@/components/ui";

// Every primitive in its states, inside the real shell, for side-by-side checks with the captures.
// Mock data only — no button here saves anything.

const STATUS_ITEMS: DropdownItem[] = [
  { value: "active", label: "เปิดใช้งาน" },
  { value: "inactive", label: "ปิดใช้งาน" },
];
const TYPE_ITEMS: DropdownItem[] = [
  { value: " ", label: "ทั้งหมด" },
  { value: "lucky-wheel", label: "วงล้อ" },
  { value: "mini-game", label: "มินิเกมส์" },
];
const AGENTS: DropdownItem[] = [
  { value: "669", label: "superxx" },
  { value: "501", label: "superx" },
];
const CUSTOMER_GROUPS: DropdownItem[] = ["VIP", "Gold", "Silver", "Bronze", "New member", "Inactive 30 days"].map((name, index) => ({
  value: String(index + 1),
  label: name,
}));
const MINI_GAMES = [
  { value: "1", text: "QA Test Wheel 0911" },
  { value: "2", text: "QA Wheel Retest 20261015" },
  { value: "3", text: "QA Other Retest 20261015" },
];
const CUSTOMERS: DropdownItem[] = ["0Tsuperx97420509115", "0Tsuperx97420509116", "superx_member_01"].map((name) => ({ value: name, label: name }));

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <h5 className="mb-2">{title}</h5>
      {children}
    </div>
  );
}

export function ComponentShowcase() {
  const [swal, swalHolder] = useCustomSweetAlert();
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
  const [toast, toastHolder] = useToast();
  const modal = useCustomModal();
  const offcanvas = useOffcanvas();
  const redeemPopup = useSystemPopup();
  const [log, setLog] = useState("—");

  const [status, setStatus] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [agent, setAgent] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>(["1", "2"]);
  const [miniGame, setMiniGame] = useState<string | null>(null);
  const [customer, setCustomer] = useState<DropdownItem | null>(null);
  const [switchOn, setSwitchOn] = useState(true);
  const [missionSwitch, setMissionSwitch] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  return (
    <div className="page-content">
      <div className="container-fluid full-container">
        <svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#50A198"></stop>
              <stop offset="1" stopColor="#FEDB6B"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="inner-container">
          <div className="custom-card">
            <div className="title-header-custom-mini-game">
              <h4 className="mb-0">Components (dev only)</h4>
            </div>
            <p className="p3 text-gray30">Last result: {log}</p>

            <Section title="Dialogs">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn system-btn btn-rounded"
                  onClick={async () => {
                    const result = await swal.open({
                      type: "saving",
                      title: "ยืนยันการสร้างข้อมูลมินิเกมส์หรือไม่ ?",
                      text: "ระบบจะทำการบันทึกข้อมูลที่คุณได้ทำการสร้างใหม่ทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ สร้างนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา",
                      onConfirm: () => new Promise((resolve) => setTimeout(resolve, 1500)),
                    });
                    setLog(`swal saving → ${result.dismiss}`);
                  }}
                >
                  Swal: saving (loading on confirm)
                </button>
                <button
                  className="btn system-btn btn-rounded"
                  onClick={async () => {
                    const result = await swal.open({
                      type: "success",
                      title: "บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ !",
                      text: "คุณสามารถกลับเข้ามาแก้ไขข้อมูลมินิเกมส์ของคุณได้ตลอดเวลา",
                      showConfirmButton: false,
                      cancelText: "ปิดหน้าต่าง",
                    });
                    setLog(`swal success → ${result.dismiss}`);
                  }}
                >
                  Swal: success
                </button>
                <button
                  className="btn system-btn btn-rounded"
                  onClick={async () => {
                    const result = await swal.open({
                      type: "danger",
                      title: "ทำรายการไม่สำเร็จ !",
                      text: "พบปัญหาในการบันทึกข้อมูล (Error : 500)",
                      showConfirmButton: false,
                      cancelText: "ปิดหน้าต่าง",
                    });
                    setLog(`swal danger → ${result.dismiss}`);
                  }}
                >
                  Swal: danger
                </button>
                <button className="btn system-btn btn-a btn-rounded" onClick={() => modal.open()}>
                  CustomModal (#modalShowWheelDetail)
                </button>
                <button
                  className="btn system-btn btn-a btn-rounded"
                  onClick={async () => {
                    const result = await popupAlert.show({
                      title: "ยืนยันการลบภารกิจ",
                      type: "delete",
                      message: "คุณต้องการลบภารกิจนี้ใช่หรือไม่",
                      needConfirmation: true,
                    });
                    setLog(`popup alert → ${result}`);
                  }}
                >
                  CustomPopupAlert: delete
                </button>
                <button
                  className="btn system-btn btn-a btn-rounded"
                  onClick={async () => {
                    const result = await popupAlert.show({ title: "online ภารกิจสำเร็จ", type: "success", message: "เปิดใช้งานภารกิจแล้ว" });
                    setLog(`popup alert → ${result}`);
                  }}
                >
                  CustomPopupAlert: success
                </button>
                <button className="mission-btn" onClick={redeemPopup.open}>
                  SystemPopup (#redeemModal)
                </button>
                <button className="btn system-btn btn-rounded" onClick={offcanvas.show}>
                  Offcanvas
                </button>
                <button className="btn system-btn btn-rounded" onClick={() => toast({ text: "Toast (toastify look)" })}>
                  Toast
                </button>
              </div>
            </Section>

            <Section title="Filters row">
              <div className="row align-items-center g-2">
                <div className="col-auto" style={{ flexBasis: "264px" }}>
                  <SearchInput id="minigameSearch" placeholder="ค้นหาด้วย ชื่อมินิเกมส์" onSearch={(value) => setLog(`search → ${value}`)} />
                </div>
                <div className="col-auto">
                  <DateRangeFilter
                    id="filterPromotionDateTime"
                    inputId="datepickerPromotionDateTime"
                    title="วันที่สร้าง: "
                    onChange={(_, text) => setLog(`date → ${text}`)}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterStatus"
                    dropdownId="dropdownStatus"
                    icon={<StatusFilterIcon />}
                    title="สถานะมินิเกมส์ :"
                    defaultText="All"
                    stretch
                    items={STATUS_ITEMS}
                    value={status}
                    onChange={setStatus}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterType"
                    dropdownId="dropdownType"
                    icon={<StatusFilterIcon />}
                    title="ประเภทมินิเกมส์ :"
                    defaultText="All"
                    items={TYPE_ITEMS}
                    value={type}
                    onChange={setType}
                  />
                </div>
              </div>
            </Section>

            <Section title="Form dropdowns, select2, switches">
              <div className="row gx-3 gy-3">
                <div className="col-4">
                  <div className="custom-input custom-float pb-2">
                    <CustomDropdown
                      id="customSelectAgentDropdown"
                      className="custom-input dropdown-wrapper require"
                      fakeClassName="multiple"
                      placeholder="เลือก Agent"
                      search
                      auto
                      stretch
                      items={AGENTS}
                      value={agent}
                      onChange={setAgent}
                    >
                      <div className="invalid-feedback">กรุณาเลือก Agent</div>
                    </CustomDropdown>
                  </div>
                </div>
                <div className="col-4">
                  <CustomDropdown
                    id="customLimitCustomerGroupDropdown"
                    multiple
                    checkbox
                    allItemLabel="ทั้งหมด"
                    placeholder="เลือกเลือกกลุ่มลูกค้าที่มีสิทธิ์ได้รับ"
                    stretch
                    auto
                    items={CUSTOMER_GROUPS}
                    value={groups}
                    onChange={setGroups}
                  />
                </div>
                <div className="col-4">
                  <Select2 id="anyMiniGameId" options={MINI_GAMES} value={miniGame} onChange={setMiniGame} />
                </div>
                <div className="col-6">
                  <GoogleDropdown
                    id="manualSelectCustomer"
                    inputId="inputSelectCustomer"
                    placeholder="พิมพ์ชื่อ ยูสเซอร์เนม หรือเกมยูสเซอร์เนม"
                    value={customer}
                    onChange={setCustomer}
                    onSearch={(keyword) =>
                      new Promise((resolve) =>
                        setTimeout(() => resolve(CUSTOMERS.filter((c) => String(c.label).includes(keyword))), 400),
                      )
                    }
                  >
                    <div className="invalid-feedback"></div>
                  </GoogleDropdown>
                </div>
                <div className="col-6 d-flex align-items-center gap-4">
                  <ToggleSwitch checked={switchOn} onChange={setSwitchOn} inputClassName="status-minigame-checkbox" />
                  <ToggleSwitch variant="mission" checked={missionSwitch} onChange={setMissionSwitch} />
                </div>
              </div>
            </Section>

            <Section title="Table states + pagination">
              <button className="btn system-btn btn-a btn-rounded mb-2" onClick={() => setLoading((value) => !value)}>
                Toggle loading
              </button>
              <div className="system-table mx-0 w-100" style={{ minHeight: "220px" }}>
                <TableLoading show={loading} />
                {!loading && (
                  <div className="table-scrollable">
                    <EmptyState />
                  </div>
                )}
                <Pagination
                  total={45}
                  offset={offset}
                  limit={limit}
                  onOffsetChange={setOffset}
                  onLimitChange={(value) => {
                    setLimit(value);
                    setOffset(0);
                  }}
                />
                <Pagination total={0} offset={0} limit={10} onOffsetChange={() => undefined} onLimitChange={() => undefined} />
              </div>
            </Section>

            <Section title="Rich text (CKEditor build) + colour pickers">
              <RichTextEditor id="minigameConditionHtml" className="input-promotion-condition-th" onChange={(html) => setLog(`editor → ${html.length} chars`)} />
              <div className="d-flex gap-4 mt-3">
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี พื้นหลังหน้าจอมินิเกมส์</h4>
                  <ColorPicker className="getColorBgMainColor" defaultValue="rgba(0, 0, 0, 0.36)" onChange={(value) => setLog(`colour → ${value}`)} />
                </div>
                <div className="session-set-color-and-title">
                  <h4 className="mb-0">สี ข้อความไฮไลท์ 1</h4>
                  <ColorPicker
                    className="getColorFontHighlightsGroup1"
                    defaultValue="linear-gradient(270deg, #AB8B4D 0%, #FFF4DE 50%, #AB8B4D 100%)"
                    onChange={(value) => setLog(`colour → ${value}`)}
                  />
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      <CustomModal control={modal} id="modalShowWheelDetail">
        <img draggable="false" className="modal-banner" src="/assets/images/swal/banner-success.png" alt="" />
        <img id="changeStatusAvatar" draggable="false" className="modal-avatar" src="/assets/images/swal/icon-success.png" alt="" />
        <div className="modal-inner">
          <h3 id="wheelNumber" className="text-success mb-2">
            Wheel 1 - จำนวนโบนัสที่แจก
          </h3>
          <div className="d-flex flex-wrap flex-lg-no-wrap gap-2" id="showModalShowWheelDetail">
            <div className="col-12 col-lg-7">
              <div className="d-flex justify-content-between">
                <span>Credit Fixed Rate</span>
                <span>1 baht</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="button" className="btn system-btn btn-a btn-rounded" onClick={() => modal.close()}>
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </CustomModal>

      <SystemPopup control={redeemPopup} id="redeemModal" className="redeem-point-modal">
        <div id="redeemModalContent" className="system-popup-content">
          <div className="system-popup-content-header align-items-center">
            <h4 className="mission-page">แลกรางวัล</h4>
          </div>
          <div className="system-popup-content-inner">
            <p className="p1 fw-700 mb-3 mission-page">สร้างรายการแลกของรางวัลให้กับสมาชิก</p>
            <div className="system-popup-btns confirm">
              <button className="mission-btn-outline system-popup-btn-cancel" onClick={redeemPopup.close}>
                ยกเลิก
              </button>
              <button className="mission-btn system-popup-btn-confirm" onClick={redeemPopup.close}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      </SystemPopup>

      <Offcanvas control={offcanvas} id="offcanvasCreateManual" className="offcanvas-minigame-custom offcanvas offcanvas-end" data-bs-focus="false">
        <div className="offcanvas-header offcanvas-header-minigame">
          <h4 className="mb-0">เพิ่มโปรให้สมาชิก (Manual)</h4>
          <div className="flex-fill"></div>
          <div className="icon-close-offcanvas-minigame-custom" onClick={offcanvas.hide}>
            <OffcanvasCloseIcon />
          </div>
        </div>
        <div className="offcanvas-body">
          <div className="label-minigame-custom mb-3">
            <span>ระบุข้อมูลลูกค้าที่ต้องการเพิ่มโปร</span>
          </div>
          <Select2 id="anyMiniGameIdOffcanvas" options={MINI_GAMES} value={miniGame} onChange={setMiniGame} />
        </div>
      </Offcanvas>

      {swalHolder}
      {popupAlertHolder}
      {toastHolder}
    </div>
  );
}
