// Values the original's top bar, sidebar and support button showed on 16/11/2026 (account wbow@superx).
// The badge counts are live on the original (polled from the API and pushed over websockets).

export const shellMock = {
  merchantName: "superx",
  username: "wbow@superx",
  displayName: "Auto Fast Track",
  language: "th" as const,
  badges: {
    member: 243, // ยืนยันสมาชิก
    deposit: 0,
    withdraw: 3,
    depositPayment: 0,
    withdrawPayment: 0,
    summationWithdrawPending: 3, // รายการรวมถอน
    rebate: 1, // อนุมัติการถอนคืนเงิน
    affiliate: 1, // อนุมัติการถอนแนะนำเพื่อน
    promotion: 12, // รายการโปรโมชั่น
    partner: 0,
    notification: 0,
    p2p: 0,
    specialNotification: 0,
  },
  supportRepliedCount: 246, // "ซัพพอร์ตตอบแล้ว 246 ข้อความ"
};
