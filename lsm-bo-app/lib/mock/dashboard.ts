// What the original /dashboard showed on 16/11/2026 for 16/11/2026 – 16/11/2026 (merchant superx).
// Field names follow the original API responses, so a real fetch can replace this file later.
// Every value here is live on the original.

// GET report.service /merchant/report-dashboard (data[0], member counts and "cards")
export const reportDashboardMock = {
  bank_deposit_amt: 0,
  deposit_bank_regis_amt: 0,
  deposit_manual_amt: 1000,
  bank_withdraw_amt: 0,
  withdraw_manual_amt: 0,
  promotion_amount: 0,
  affiliate_amount: 0,
  allmembers: 630,
  newmembers: 2,
  cards: {
    deposit: { cnt: 1, members: 1 },
    withdraw: { cnt: 0, members: 0 },
    new_member: {
      deposit_amount: 1000,
      deposit_cnt: 1,
      deposit_members: 1,
      withdraw_amount: 0,
      withdraw_cnt: 0,
      withdraw_members: 0,
      first_deposit_amount: 0,
      registered_deposit: 1,
      registered_no_deposit: 1,
    },
    old_member: {
      count: 628,
      deposit_amount: 0,
      deposit_cnt: 0,
      deposit_members: 0,
      withdraw_amount: 0,
      withdraw_cnt: 0,
      withdraw_members: 0,
      first_deposit_amount: 0,
      first_deposit_members: 0,
    },
    fee_amount: 0,
    expenses: { marketing: 20, general: 0 },
  },
};

// Payment-gateway totals (payment.service /merchant/payment-reportbyprovider)
export const paymentTotalsMock = { sum_deposit_payment_amount: 0, sum_withdraw_payment_amount: 0 };

// affiliate.service /affiliate-downline: members who signed up through an affiliate link
export const affiliateMembersMock = 0;

// rebate.service /reportbytype and /reportbytypestep: sum of "comm" per report
export const rebateMock = { rebate: 0, stepTurnover: 0, stepWinLoss: 0 };

// payment.service /merchant/wallet, in the original order. is_open_* is null for OneSlip accounts
// (the original then shows no limit lines). OneSlip min/max are not shown, so they are 0 here.
export const walletPaymentsMock = [
  { provider: "Ampay01", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "2.00", fee_withdraw: "0.4", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "1000", max_deposit: "200000", min_withdraw: "300", max_withdraw: "40000" },
  { provider: "CloudPayX168", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "1.90", fee_withdraw: "0.3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "300.00", min_deposit: "300", max_deposit: "20000", min_withdraw: "2000", max_withdraw: "20000" },
  { provider: "Compay01", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "1.20", fee_withdraw: "0.5", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "20", max_deposit: "45000", min_withdraw: "20", max_withdraw: "45000" },
  { provider: "GM2Pay", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.30", fee_withdraw: "0.3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "JoinPay", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.00", fee_withdraw: "0.3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "SMILEPAY", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "2.90", fee_withdraw: "0.5", fee_constant_deposit: "0", fee_constant_withdraw: "0", balance: "0.00", min_deposit: "100", max_deposit: "30000", min_withdraw: "100", max_withdraw: "30000" },
  { provider: "One2Coin", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "5804.38", min_deposit: "100", max_deposit: "500000", min_withdraw: "100", max_withdraw: "500000" },
  { provider: "OnePaymentStaging", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "2.00", fee_withdraw: "3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "2873.00", min_deposit: "10", max_deposit: "50000000", min_withdraw: "10", max_withdraw: "50000000" },
  { provider: "Paydiwa01", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.35", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "5.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "PaymentPlus", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.60", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "PayTwoOneBadoo", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.20", fee_withdraw: "0.2", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "PayTwoOneMaxPlus", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.00", fee_withdraw: "0.4", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "PayTwoOneOne2CoinStaging", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "300.00", min_deposit: "100", max_deposit: "5000", min_withdraw: "100", max_withdraw: "5000" },
  { provider: "PomPayTum", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "1", max_deposit: "1000000", min_withdraw: "1", max_withdraw: "1000002" },
  { provider: "Qpay", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.30", fee_withdraw: "0.3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "SPAY", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.50", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "SWIFTFOX", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "1.60", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "TumP2P", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "-55.00", min_deposit: "1", max_deposit: "1000000", min_withdraw: "1", max_withdraw: "1000002" },
  { provider: "WealthWave", is_open_deposit: 1, is_open_withdraw: 1, fee_deposit: "2.00", fee_withdraw: "0.3", fee_constant_deposit: "0.00", fee_constant_withdraw: "0.00", balance: "-10.00", min_deposit: "100", max_deposit: "40000", min_withdraw: "100", max_withdraw: "49000" },
  { provider: "ZAPPAY", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "10.00", balance: "391.20", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "ZAPPAY02", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.00", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "10.00", balance: "29.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "ZAPPAY03", is_open_deposit: 0, is_open_withdraw: 0, fee_deposit: "2.20", fee_withdraw: "0", fee_constant_deposit: "0.00", fee_constant_withdraw: "10.00", balance: "0.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "OneSlip - SlipExpress", is_open_deposit: null, is_open_withdraw: null, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0", fee_constant_withdraw: "0", balance: "242.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
  { provider: "OneSlip - พิกุล เงิน", is_open_deposit: null, is_open_withdraw: null, fee_deposit: "0.00", fee_withdraw: "0", fee_constant_deposit: "0", fee_constant_withdraw: "0", balance: "102.00", min_deposit: "0", max_deposit: "0", min_withdraw: "0", max_withdraw: "0" },
];
