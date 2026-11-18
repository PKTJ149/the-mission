// Data for /dashboard. The page calls these instead of reading the mock, so each body can later
// become a real fetch() to the original endpoints without touching the page.
import {
  affiliateMembersMock,
  paymentTotalsMock,
  rebateMock,
  reportDashboardMock,
  walletPaymentsMock,
} from "@/lib/mock/dashboard";

export type DateRange = { from: string; to: string }; // YYYY-MM-DD, like the original's query

export type WalletPayment = {
  provider: string;
  is_open_deposit: 0 | 1 | null;
  is_open_withdraw: 0 | 1 | null;
  fee_deposit: string;
  fee_withdraw: string;
  fee_constant_deposit: string;
  fee_constant_withdraw: string;
  balance: string;
  min_deposit: string;
  max_deposit: string;
  min_withdraw: string;
  max_withdraw: string;
};

export type DashboardData = {
  report: typeof reportDashboardMock;
  paymentTotals: typeof paymentTotalsMock;
  affiliateMembers: number;
  rebate: typeof rebateMock;
  walletPayments: WalletPayment[];
};

// The mock ignores the range: it always returns what the original showed for 16/11/2026.
export async function getDashboard(range?: DateRange): Promise<DashboardData> {
  void range;
  return {
    report: reportDashboardMock,
    paymentTotals: paymentTotalsMock,
    affiliateMembers: affiliateMembersMock,
    rebate: rebateMock,
    walletPayments: walletPaymentsMock as WalletPayment[],
  };
}
