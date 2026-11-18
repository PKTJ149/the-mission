// All copy and demo data for the Minigames promo page (/minigames), in one place so it is easy to edit.
// Rule (PK): no prices, no made-up numbers / stats / testimonials. Every fact below is something the
// real Mini Games and Missions back office can do. Demo rewards are illustrative only.

export const HERO = {
  eyebrow: "MINI GAMES & MISSIONS",
  titleLead: "MINI GAMES -",
  titleAccent: "PLAY, ENGAGE, REPEAT.",
  sub: "ทุกลูกค้ามีค่า ไม่ใช่แค่หามา แต่ต้องรักษาไว้ด้วย",
  body: "เปลี่ยนทุกการเล่นให้เป็นโอกาสสร้างความผูกพัน ด้วย Mini Games ที่ปรับแต่งเกม กติกา และรางวัลได้ตามแคมเปญของคุณ",
  primaryCta: "เปิดใช้บริการ",
  secondaryCta: "ลองเล่นตัวอย่าง",
  // Small line under the buttons
  note: "วงล้อนำโชค • กล่องสุ่ม • เปิดไพ่ • ภารกิจ ครบในระบบเดียว",
};

// Floating reward chips around the hero phone (illustrative)
export const HERO_CHIPS = ["+100 เครดิต", "+1 สิทธิ์หมุน", "50 แต้ม", "ภารกิจสำเร็จ"];

// Capability strip under the hero: true facts only
export const CAPABILITIES = [
  { value: "6 / 8 / 10", label: "ช่องบนวงล้อนำโชค" },
  { value: "3 / 6 / 9", label: "ตัวเลือกในเกมกล่องสุ่ม / เปิดไพ่" },
  { value: "3", label: "โครงสร้างภารกิจ" },
  { value: "5", label: "รูปแบบเงื่อนไขภารกิจ" },
  { value: "28", label: "จุดสีธีมที่ปรับได้" },
  { value: "TH / EN / TL", label: "รองรับ 3 ภาษา" },
];

export type DemoKey = "wheel" | "box" | "cards" | "missions";

export const DEMO_SECTION = {
  eyebrow: "LIVE DEMO",
  title: "ลองเล่นเลย",
  sub: "นี่คือสิ่งที่ลูกค้าของคุณจะได้เล่นบนหน้าเว็บ ลองกดเล่นได้ทุกเกม",
  disclaimer: "ตัวอย่างจำลองเท่านั้น ไม่มีการส่งข้อมูล รางวัลเป็นเพียงภาพประกอบ",
  settingsTitle: "ตั้งค่าได้ใน Back Office",
};

export const DEMO_TABS: { key: DemoKey; label: string; icon: string; settings: string[] }[] = [
  {
    key: "wheel",
    label: "วงล้อนำโชค",
    icon: "pi-sun",
    settings: [
      "เลือกจำนวนช่อง 6 / 8 / 10 ช่อง",
      "กำหนดรางวัลและโอกาสออก (%) ของแต่ละช่อง",
      "ใช้กรอบวงล้อ ปุ่มหมุน และป๊อปอัปรางวัลเป็นรูปของแบรนด์เอง",
      "ทดลองหมุนก่อนเปิดใช้จริง",
      "ให้สิทธิ์หมุนจากยอดฝาก: ฝากครั้งเดียว ฝากสะสม หรือฝากติดต่อกัน",
    ],
  },
  {
    key: "box",
    label: "กล่องสุ่ม",
    icon: "pi-box",
    settings: [
      "เลือกจำนวนตัวเลือก 3 / 6 / 9 กล่อง",
      "ใส่รูปก่อนเลือก หลังเลือก และรูปผลรางวัลได้เอง",
      "ตั้งรางวัลและโอกาสออกของแต่ละตัวเลือก",
      "จำกัดสิทธิ์ต่อสมาชิก ต่อครั้ง วัน สัปดาห์ เดือน หรือต่อโปร",
    ],
  },
  {
    key: "cards",
    label: "เปิดไพ่",
    icon: "pi-clone",
    settings: [
      "เลือกจำนวนไพ่ 3 / 6 / 9 ใบ",
      "ให้รูปผลรางวัลเหมือนกันทุกใบ หรือแตกต่างกันทุกใบ",
      "เปิดเล่นตามวันที่ วันธรรมดา เสาร์-อาทิตย์ หรือทุกวัน และกำหนดช่วงเวลาได้",
      "แสดงนับถอยหลังได้ 8 สไตล์",
    ],
  },
  {
    key: "missions",
    label: "ภารกิจ",
    icon: "pi-flag",
    settings: [
      "3 โครงสร้าง: ภารกิจเดี่ยว เรียงลำดับ หรือไม่เรียงลำดับ",
      "5 เงื่อนไข: ฝากเงิน ทำเทิร์นสะสม ชวนเพื่อน เช็คอินประจำวัน สะสมแต้ม",
      "ให้รางวัลทุกภารกิจย่อย และรางวัลใหญ่เมื่อจบภารกิจหลัก",
      "รางวัลเป็นเครดิต สิทธิ์เล่น หรือแต้ม และแลกแต้มเป็นรางวัลได้",
      "แบนเนอร์ภารกิจ และแจ้งเตือนก่อนหมดอายุ",
    ],
  },
];

// ---- Demo data (illustrative rewards) ----

export type WheelSlice = { value: string; unit: string; color: string; ink: string };

// 8 slices, colours from the sidebar Minigames icon. `ink` keeps the label readable on light slices.
export const WHEEL_SLICES: WheelSlice[] = [
  { value: "+100", unit: "เครดิต", color: "#FF4D8D", ink: "#FFFFFF" },
  { value: "+1", unit: "สิทธิ์หมุน", color: "#FFC93C", ink: "#4A2600" },
  { value: "50", unit: "แต้ม", color: "#3BA3FF", ink: "#FFFFFF" },
  { value: "+10%", unit: "เครดิต", color: "#19C3A6", ink: "#003B33" },
  { value: "+20", unit: "เครดิต", color: "#8B5CF6", ink: "#FFFFFF" },
  { value: "+2", unit: "สิทธิ์หมุน", color: "#FF7A2F", ink: "#FFFFFF" },
  { value: "200", unit: "แต้ม", color: "#22C55E", ink: "#06361A" },
  { value: "+50", unit: "เครดิต", color: "#EF4444", ink: "#FFFFFF" },
];

export const BOX_REWARDS = ["+50 เครดิต", "+1 สิทธิ์หมุน", "100 แต้ม", "+5% เครดิต", "+2 สิทธิ์เปิดกล่อง", "+20 เครดิต"];

export const CARD_REWARDS = ["+100 เครดิต", "50 แต้ม", "+1 สิทธิ์หมุน", "+20 เครดิต", "200 แต้ม", "+10% เครดิต"];

export type MissionStep = { action: string; icon: string; task: string; target: number; unit: string; reward: string };

export const MISSION_DEMO = {
  title: "ภารกิจต้อนรับสมาชิกใหม่",
  structure: "เรียงลำดับ",
  mainReward: "+100 เครดิต",
  steps: [
    { action: "เช็คอินประจำวัน", icon: "pi-calendar", task: "เช็คอินครบ 3 วัน", target: 3, unit: "วัน", reward: "+1 สิทธิ์หมุน" },
    { action: "ฝากเงิน", icon: "pi-wallet", task: "ฝากสะสมครบ 500 บาท", target: 500, unit: "บาท", reward: "+20 เครดิต" },
    { action: "ทำเทิร์นสะสม", icon: "pi-sync", task: "ทำเทิร์นสะสม 1,000 บาท", target: 1000, unit: "บาท", reward: "50 แต้ม" },
    { action: "ชวนเพื่อน", icon: "pi-user-plus", task: "ชวนเพื่อนสมัคร 1 คน", target: 1, unit: "คน", reward: "+1 สิทธิ์เปิดกล่อง" },
    { action: "สะสมแต้ม", icon: "pi-star", task: "สะสมครบ 100 แต้ม", target: 100, unit: "แต้ม", reward: "+50 เครดิต" },
  ] satisfies MissionStep[],
};

// ---- Features ----

export const FEATURES_SECTION = {
  eyebrow: "FEATURES",
  title: "ปรับแต่งได้ทุกอย่าง ตามแคมเปญของคุณ",
  sub: "ตั้งค่าเกม กติกา และรางวัลเองได้ทั้งหมดจาก Back Office",
  detailTitle: "ความสามารถทั้งหมดในระบบ",
};

export const FEATURES = [
  { icon: "pi-palette", title: "Customizable Design", text: "เปลี่ยนสี ธีม และรูปแบบเกม ให้เข้ากับแบรนด์และเทศกาล" },
  { icon: "pi-sliders-h", title: "Flexible Game Rules", text: "กำหนดกลุ่มผู้เล่น จำนวนครั้ง และการใช้สิทธิ์ร่วม/แยก" },
  { icon: "pi-gift", title: "Reward Management", text: "กำหนดรางวัลได้ทั้งสิทธิ์เล่นเพิ่ม เครดิตเว็บไซต์ และคะแนนสะสม" },
  { icon: "pi-clone", title: "Multiple Campaigns", text: "เปิดหลายเกมหรือหลายวงล้อ พร้อมแยกกติกาตามแคมเปญ" },
];

// Detailed capabilities (from the real minigame settings wizard)
export const CAPABILITY_DETAILS = [
  {
    icon: "pi-wallet",
    title: "สิทธิ์เล่นจากยอดฝาก",
    tags: ["ฝากครั้งเดียว", "ฝากสะสม", "ฝากติดต่อกัน", "เท่ากับ / ขั้นต่ำ / สูงสุด / ช่วงยอด"],
  },
  {
    icon: "pi-clock",
    title: "วันเวลาและนับถอยหลัง",
    tags: ["ช่วงวันที่", "วันธรรมดา / เสาร์-อาทิตย์ / ทุกวัน", "หลายช่วงเวลา", "นับถอยหลัง 8 สไตล์"],
  },
  {
    icon: "pi-shield",
    title: "จำกัดสิทธิ์และกลุ่มลูกค้า",
    tags: ["ต่อระบบ / ต่อสมาชิก", "ต่อครั้ง วัน สัปดาห์ เดือน โปร", "กลุ่มลูกค้า", "รีเซ็ตสิทธิ์", "จำกัดค่ายเกม"],
  },
  {
    icon: "pi-gift",
    title: "รางวัลและโอกาสออก",
    tags: ["เครดิตคงที่", "เครดิต %", "สิทธิ์เล่นเพิ่ม", "แต้ม", "โควตา", "รางวัลตั้งชื่อเอง", "โอกาส % ต่อช่อง"],
  },
  {
    icon: "pi-sync",
    title: "เงื่อนไขเทิร์นโอเวอร์",
    tags: ["เทิร์น x เท่า", "เทิร์น x บาท", "ก่อน / หลังทำเทิร์น"],
  },
  {
    icon: "pi-images",
    title: "ธีมและรูปภาพ",
    tags: ["พื้นหลังแยกตามอุปกรณ์", "28 จุดสี", "กรอบวงล้อ ปุ่มหมุน ป๊อปอัป"],
  },
  {
    icon: "pi-language",
    title: "หลายภาษา หลายเอเย่นต์",
    tags: ["TH / EN / TL", "แยกตามเอเย่นต์", "เปิดหลายเกมพร้อมกัน"],
  },
  {
    icon: "pi-chart-bar",
    title: "รายงานและการแจกสิทธิ์",
    tags: ["รายงานสรุป", "รายสมาชิก", "ประวัติการเล่น", "แจกสิทธิ์ด้วยตนเอง"],
  },
];

// ---- Missions ----

export const MISSIONS_SECTION = {
  eyebrow: "MISSIONS",
  title: "ภารกิจที่พาลูกค้ากลับมาทุกวัน",
  sub: "ออกแบบเส้นทางของลูกค้าได้ 3 แบบ แต่ละภารกิจย่อยเลือกเงื่อนไขได้ 5 รูปแบบ",
  actionsTitle: "เงื่อนไขภารกิจ 5 รูปแบบ",
  extrasTitle: "และยังมี",
};

export type StructureKind = "single" | "sequential" | "any";

export const MISSION_STRUCTURES: { kind: StructureKind; title: string; text: string }[] = [
  { kind: "single", title: "ภารกิจเดี่ยว", text: "ทำเงื่อนไขให้ครบ รับรางวัลทันที" },
  {
    kind: "sequential",
    title: "ภารกิจหลัก + ภารกิจย่อยเรียงลำดับ",
    text: "ทำเสร็จแล้วปลดล็อกข้อถัดไป ทุกข้อมีรางวัล และรางวัลใหญ่เมื่อจบภารกิจหลัก",
  },
  { kind: "any", title: "ภารกิจย่อยไม่เรียงลำดับ", text: "ทำข้อไหนก่อนก็ได้ ครบตามที่กำหนดแล้วรับรางวัลใหญ่" },
];

export const ACTION_TYPES = [
  { icon: "pi-wallet", label: "ฝากเงิน" },
  { icon: "pi-sync", label: "ทำเทิร์นสะสม" },
  { icon: "pi-user-plus", label: "ชวนเพื่อน" },
  { icon: "pi-calendar", label: "เช็คอินประจำวัน" },
  { icon: "pi-star", label: "สะสมแต้ม" },
];

export const MISSION_EXTRAS = [
  { icon: "pi-ticket", label: "แลกแต้มเป็นรางวัล" },
  { icon: "pi-images", label: "แบนเนอร์ภารกิจ" },
  { icon: "pi-bell", label: "แจ้งเตือนก่อนหมดอายุ" },
  { icon: "pi-chart-bar", label: "รายงานตามสมาชิก ภารกิจ และรางวัล" },
  { icon: "pi-history", label: "ประวัติการแก้ไข" },
];

// ---- Benefits, steps, final CTA ----

export const BENEFITS_SECTION = { eyebrow: "BUSINESS BENEFITS", title: "ประโยชน์ต่อธุรกิจของคุณ" };

export const BENEFITS = [
  { icon: "pi-bolt", title: "เพิ่ม Engagement", text: "เกมสั้น ๆ ที่เล่นได้ทุกวัน ให้ลูกค้ามีเหตุผลเข้ามาที่เว็บบ่อยขึ้น" },
  { icon: "pi-replay", title: "ส่งเสริมการกลับมาใช้งาน", text: "สิทธิ์รายวัน เช็คอิน และภารกิจต่อเนื่อง ชวนให้ลูกค้ากลับมาอีก" },
  { icon: "pi-heart", title: "สร้าง Customer Loyalty", text: "รางวัลและแต้มสะสมที่แลกได้ ทำให้ลูกค้าผูกพันกับแบรนด์" },
  { icon: "pi-megaphone", title: "ต่อยอดแคมเปญการตลาด", text: "ผูกสิทธิ์เล่นกับยอดฝากและเทิร์น เปิดหลายแคมเปญพร้อมกันได้" },
];

export const STEPS_SECTION = { eyebrow: "HOW IT STARTS", title: "เริ่มต้นง่าย ๆ ใน 3 ขั้นตอน" };

export const STEPS = [
  { icon: "pi-comments", title: "ติดต่อทีมงานเพื่อเปิดใช้บริการ", text: "แจ้งทีมงาน เราเปิดระบบให้กับเว็บไซต์ของคุณ" },
  { icon: "pi-sliders-h", title: "ตั้งค่าเกม / ภารกิจใน Back Office", text: "เลือกเกม กติกา รางวัล ธีม และช่วงเวลาได้เอง" },
  { icon: "pi-chart-line", title: "ลูกค้าเล่นบนหน้าเว็บ และดูผลในรายงาน", text: "ติดตามผลรายสมาชิก รายภารกิจ และรายรางวัล" },
];

export const FINAL_CTA = {
  title: "พร้อมให้ลูกค้าเล่น แล้วกลับมาอีกหรือยัง?",
  sub: "ติดต่อทีมงานเพื่อเปิดใช้ Mini Games และ Missions บนเว็บไซต์ของคุณ",
  primaryCta: "เปิดใช้บริการ",
  secondaryCta: "ลองเล่นตัวอย่างอีกครั้ง",
};
