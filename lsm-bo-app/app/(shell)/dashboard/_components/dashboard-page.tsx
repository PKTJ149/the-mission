"use client";

import { useState } from "react";
import { Button } from "@/components/primevue/button";
import { Calendar } from "@/components/primevue/calendar";
import { NumberFormat } from "@/components/primevue/number-format";
import { getDashboard, type DashboardData } from "@/lib/api/dashboard";
import { useToday } from "@/lib/use-mounted";
import { BAHT, ChannelCell, ChannelRow, D, ExpenseCard, MoneyLine, PERSON, StatCard, TotalBox } from "./cards";
import { ProviderCard } from "./provider-card";

const toQueryDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// pages/dashboard ("กระดานแดชบอร์ด"): date range filter, deposit / withdrawal totals,
// expenses and profit, member stats and the payment-gateway account cards.
export function DashboardPage({ initialData }: { initialData: DashboardData }) {
  const today = useToday();
  const [data, setData] = useState(initialData);
  // Both pickers default to today, like the original (null = not picked yet)
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const from = dateFrom ?? today;
  const to = dateTo ?? today;

  const { report, paymentTotals, rebate } = data;
  const cards = report.cards;
  const totalDeposit =
    report.deposit_manual_amt + report.deposit_bank_regis_amt + report.bank_deposit_amt + paymentTotals.sum_deposit_payment_amount;
  const totalWithdraw = report.withdraw_manual_amt + report.bank_withdraw_amt + paymentTotals.sum_withdraw_payment_amount;
  const profit = totalDeposit - totalWithdraw - cards.expenses.marketing - cards.expenses.general - cards.fee_amount;

  // ค้นหา: reload the report for the picked range (the mock returns the same numbers)
  const search = async () => {
    if (!from || !to) return;
    setData(await getDashboard({ from: toQueryDate(from), to: toQueryDate(to) }));
  };
  // รายงานวันนี้: both pickers back to today, then reload
  const showToday = async () => {
    const now = new Date();
    setDateFrom(now);
    setDateTo(now);
    setData(await getDashboard({ from: toQueryDate(now), to: toQueryDate(now) }));
  };

  return (
    <div {...D}>
      <div {...D}>
        <div {...D} className="p-0">
          <div {...D}>
            <span {...D} className="text-title mb-3">
              กระดานแดชบอร์ด
            </span>
          </div>{" "}
          <div {...D}>
            <br {...D} />
          </div>{" "}
          <div {...D} className="p-blockui-container">
            {/* Date range filter */}
            <div {...D} className="surface-card shadow-2 p-3 border-1 border-50 border-round">
              <div {...D} className="flex justify-content-between mb-3">
                <div {...D} className="grid p-fluid">
                  <div {...D} className="col-12 md:col-3 lg:pl-2">
                    <span {...D} className="text-800 font-medium">
                      จากวันที่ :
                    </span>{" "}
                    <Calendar scope="data-v-3c285718" value={from} onChange={setDateFrom} />
                  </div>{" "}
                  <div {...D} className="col-12 md:col-3 lg:pl-2">
                    <span {...D} className="text-800 font-medium">
                      {" ถึงวันที่ :"}
                    </span>{" "}
                    <Calendar scope="data-v-3c285718" value={to} onChange={setDateTo} />
                  </div>{" "}
                  <div {...D} className="col-12 md:col-3 lg:pl-0">
                    <span {...D} className="text-white block font-medium">
                      :
                    </span>{" "}
                    <div {...D} className="flex">
                      <div {...D} className="flex-1 px-2">
                        <Button scope="data-v-3c285718" className="p-button-sm p-button-primary inline-block" icon="pi pi-search" label="ค้นหา" onClick={search} />
                      </div>{" "}
                      <div {...D} className="flex-1 px-2">
                        <Button
                          scope="data-v-3c285718"
                          className="p-button-sm p-button-danger inline-block"
                          icon="pi pi-search"
                          label="รายงานวันนี้"
                          onClick={showToday}
                        />
                      </div>
                    </div>
                  </div>{" "}
                  <div {...D} className="ml-2">
                    <small {...D} className="text-red-500">
                      * หมายเหตุ: รายงานวันที่ 01/01/2024 จะเริ่มจากเวลา 01/01/2024 11.00.00 น. ถึง 02/01/2024 10.59.59 น.
                    </small>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Deposit / withdrawal totals */}
            <div {...D} className="surface-card shadow-2 p-3 border-1 border-50 border-round my-2">
              <div {...D} className="flex justify-content-between mb-0">
                <div {...D} className="p-0 flex flex-column flex-auto mt-3">
                  <div {...D} className="grid">
                    <div {...D} className="col-12">
                      <div {...D} className="grid">
                        <TotalBox kind="deposit" amount={totalDeposit} count={cards.deposit.cnt} members={cards.deposit.members} />{" "}
                        <TotalBox kind="withdraw" amount={totalWithdraw} count={cards.withdraw.cnt} members={cards.withdraw.members} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            <ChannelRow>
              <ChannelCell icon="pi-arrow-circle-up text-teal-400" label="ยอดฝากผ่านธนาคาร" amount={report.bank_deposit_amt + report.deposit_bank_regis_amt} />{" "}
              <ChannelCell icon="pi-arrow-circle-up text-green-500" label="ยอดฝากผ่านเพย์เมนต์เกตเวย์" amount={paymentTotals.sum_deposit_payment_amount} />{" "}
              <ChannelCell icon="pi-arrow-circle-up text-yellow-500" label="ยอดฝากโดยทำรายการมือ" amount={report.deposit_manual_amt} last />
            </ChannelRow>{" "}
            <ChannelRow>
              <ChannelCell icon="pi-arrow-circle-down text-blue-500" label="ยอดถอนผ่านธนาคาร" amount={report.bank_withdraw_amt} />{" "}
              <ChannelCell icon="pi-arrow-circle-down text-orange-500" label="ยอดถอนผ่านเพย์เมนต์เกตเวย์" amount={paymentTotals.sum_withdraw_payment_amount} />{" "}
              <ChannelCell icon="pi-arrow-circle-down text-purple-500" label="ยอดถอนโดยทำรายการมือ" amount={report.withdraw_manual_amt} last />
            </ChannelRow>{" "}
            <div {...D} className="text-700 font-medium mb-2 mt-1">
              ค่าใช้จ่ายและกำไร
            </div>{" "}
            <div {...D} className="dash-grid dash-grid-stat">
              {/* ORIGINAL: เพิ่มค่าใช้จ่าย opens the expense dialog (list / add / edit / delete) */}
              <ExpenseCard title="ค่าการตลาด" amount={cards.expenses.marketing} />{" "}
              <ExpenseCard title="รายจ่ายทั่วไป" amount={cards.expenses.general} />{" "}
              <ExpenseCard title="ค่าธรรมเนียม" amount={cards.fee_amount} hint="ค่าธรรมเนียมเพย์เมนต์เกตเวย์" />{" "}
              <ExpenseCard
                title="กำไร"
                amount={profit}
                valueClass={`font-medium text-xl mb-2 ${profit < 0 ? "text-red-500" : "text-green-600"}`}
                hint="ฝาก − ถอน − การตลาด − รายจ่ายทั่วไป − ค่าธรรมเนียม"
              />
            </div>{" "}
            <div {...D} className="dash-grid dash-grid-stat">
              <StatCard title="สมาชิกทั้งหมด" value={report.allmembers} decimal={0} unit={PERSON} color="teal" icon="pi-users" />{" "}
              <StatCard title="สมาชิกใหม่" value={report.newmembers} decimal={0} unit={PERSON} color="pink" icon="pi-user">
                <MoneyLine
                  first
                  label="ฝาก"
                  amount={cards.new_member.deposit_amount}
                  count={cards.new_member.deposit_cnt}
                  members={cards.new_member.deposit_members}
                />{" "}
                <MoneyLine
                  label="ถอน"
                  amount={cards.new_member.withdraw_amount}
                  count={cards.new_member.withdraw_cnt}
                  members={cards.new_member.withdraw_members}
                />
              </StatCard>{" "}
              <StatCard title="สมัคร (ฝาก)" value={cards.new_member.registered_deposit} decimal={0} unit={PERSON} color="yellow" icon="pi-user-plus">
                <small {...D} className="block text-600 mt-2">
                  ยอดฝากแรกรวม <NumberFormat value={cards.new_member.first_deposit_amount} decimal={2} /> {BAHT}
                </small>
              </StatCard>{" "}
              <StatCard title="สมัคร (ไม่ฝาก)" value={cards.new_member.registered_no_deposit} decimal={0} unit={PERSON} color="green" icon="pi-user-minus" />{" "}
              <StatCard title="สมาชิกเก่า" value={cards.old_member.count} decimal={0} unit={PERSON} color="indigo" icon="pi-users">
                <MoneyLine
                  first
                  label="ฝาก"
                  amount={cards.old_member.deposit_amount}
                  count={cards.old_member.deposit_cnt}
                  members={cards.old_member.deposit_members}
                />{" "}
                <MoneyLine
                  label="ถอน"
                  amount={cards.old_member.withdraw_amount}
                  count={cards.old_member.withdraw_cnt}
                  members={cards.old_member.withdraw_members}
                />
              </StatCard>{" "}
              <StatCard title="สมาชิกเก่าฝากแรก" value={cards.old_member.first_deposit_amount} decimal={2} unit={BAHT} color="indigo" icon="pi-wallet">
                <small {...D} className="block text-600 mt-2">
                  (<NumberFormat value={cards.old_member.first_deposit_members} decimal={0} /> {PERSON})
                </small>
              </StatCard>
            </div>{" "}
            <div {...D} className="dash-grid dash-grid-stat">
              <StatCard title="สมัครผ่านลิงก์ Affiliate" value={data.affiliateMembers} decimal={0} unit={PERSON} color="blue" icon="pi-sitemap" />{" "}
              <StatCard title="ยอดแนะนำเพื่อนที่สมาชิกได้รับ" value={report.affiliate_amount} decimal={2} unit={BAHT} color="orange" icon="pi-share-alt" />{" "}
              <StatCard title="ยอดเงินคืนที่สมาชิกได้รับ" value={rebate.rebate} decimal={2} unit={BAHT} color="cyan" icon="pi-inbox" />{" "}
              <StatCard
                title="ยอดเงินคืนแบบขั้นบันไดที่สมาชิกได้รับ (ยอดเทิร์นโอเวอร์)"
                value={rebate.stepTurnover}
                decimal={2}
                unit={BAHT}
                color="cyan"
                icon="pi-inbox"
              />{" "}
              <StatCard
                title="ยอดเงินคืนแบบขั้นบันไดที่สมาชิกได้รับ (ยอดชนะ/แพ้)"
                value={rebate.stepWinLoss}
                decimal={2}
                unit={BAHT}
                color="cyan"
                icon="pi-inbox"
              />{" "}
              <StatCard title="ยอดโปรโมชั่นที่สมาชิกได้รับ" value={report.promotion_amount} decimal={2} unit={BAHT} color="purple" icon="pi-money-bill" />
            </div>{" "}
            <div {...D} className="text-lg mb-2">
              <i {...D} className="pi pi-building"></i>
              {" บัญชีเพย์เมนต์เกตเวย์ :\n                "}
            </div>{" "}
            <div {...D} className="dash-grid dash-grid-provider">
              {data.walletPayments.map((provider) => (
                <ProviderCard key={provider.provider} provider={provider} />
              ))}
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
