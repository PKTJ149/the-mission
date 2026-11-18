import type { ReactNode } from "react";
import { Button } from "@/components/primevue/button";
import { NumberFormat } from "@/components/primevue/number-format";

// Building blocks of pages/dashboard (data-v-3c285718).
export const D = { "data-v-3c285718": "" };

export const BAHT = "บาท";
export const PERSON = "คน";
export const ITEMS = "รายการ";

// Big green / red box: total deposit or withdrawal of the range
type TotalBoxProps = {
  kind: "deposit" | "withdraw";
  amount: number;
  count: number;
  members: number;
};

export function TotalBox({ kind, amount, count, members }: TotalBoxProps) {
  const deposit = kind === "deposit";
  const tone = deposit ? "green" : "red";
  return (
    <div {...D} className="col-12 md:col-6 lg:col-6 p-2">
      <div {...D} className={`p-3 text-center bg-box-${kind} border-round`}>
        <span {...D} className={`inline-flex justify-content-center align-items-center bg-${tone}-600 border-circle mb-3 p-3`}>
          <i {...D} className={`pi ${deposit ? "pi-upload" : "pi-download"} text-xl text-white`}></i>
        </span>{" "}
        <div {...D} className="text-2xl font-medium text-white mb-2">
          <NumberFormat value={amount} decimal={2} /> {BAHT}
          {deposit && " "}
        </div>{" "}
        <span {...D} className={`text-${tone}-100 font-medium`}>
          {deposit ? "ยอดฝาก" : "ยอดถอน"}
        </span>{" "}
        <div {...D} className={`text-${tone}-100 mt-1`}>
          <NumberFormat value={count} decimal={0} /> {ITEMS} (<NumberFormat value={members} decimal={0} /> {PERSON})
        </div>
      </div>
    </div>
  );
}

// One column of the "ยอดฝากผ่านธนาคาร / เพย์เมนต์เกตเวย์ / ทำรายการมือ" rows
type ChannelProps = { icon: string; label: string; amount: number; last?: boolean };

export function ChannelCell({ icon, label, amount, last }: ChannelProps) {
  return (
    <div {...D} className={last ? "flex-auto p-3" : "border-bottom-1 md:border-right-1 md:border-bottom-none surface-border flex-auto p-3"}>
      <div {...D} className="flex align-items-center mb-3">
        <i {...D} className={`pi ${icon} text-xl mr-2`}></i>{" "}
        <span {...D} className="text-500 font-medium">
          {label}
        </span>
      </div>{" "}
      <span {...D} className="block text-900 font-medium mb-4 text-xl">
        <NumberFormat value={amount} decimal={2} /> {BAHT}
      </span>
    </div>
  );
}

export function ChannelRow({ children }: { children: ReactNode }) {
  return (
    <div {...D} className="flex flex-column flex-auto">
      <div {...D} className="grid">
        <div {...D} className="col-12">
          <div {...D} className="surface-card shadow-2 border-round flex p-3 flex-column md:flex-row">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// "ค่าใช้จ่ายและกำไร" cards: title, amount, then a button or a hint line
type ExpenseCardProps = { title: string; amount: number; valueClass?: string; hint?: string; onAdd?: () => void };

export function ExpenseCard({ title, amount, valueClass = "text-900 font-medium text-xl mb-2", hint, onAdd }: ExpenseCardProps) {
  return (
    <div {...D}>
      <div {...D} className="surface-card shadow-2 p-3 border-1 border-50 border-round">
        <span {...D} className="block text-500 font-medium mb-3">
          {title}
        </span>{" "}
        <div {...D} className={valueClass}>
          <NumberFormat value={amount} decimal={2} /> {BAHT}
        </div>{" "}
        {hint !== undefined ? (
          <small {...D} className="text-500">
            {hint}
          </small>
        ) : (
          <Button scope="data-v-3c285718" className="p-button-sm p-button-outlined" icon="pi pi-plus" label="เพิ่มค่าใช้จ่าย" onClick={onAdd} />
        )}
      </div>
    </div>
  );
}

// Stat card with a coloured icon square on the right
type StatCardProps = {
  title: string;
  value: number;
  decimal: number;
  unit: string;
  color: string; // teal, pink, …
  icon: string;
  children?: ReactNode; // the small lines under the value
};

export function StatCard({ title, value, decimal, unit, color, icon, children }: StatCardProps) {
  return (
    <div {...D}>
      <div {...D} className="surface-card shadow-2 p-3 border-1 border-50 border-round">
        <div {...D} className="flex justify-content-between mb-3">
          <div {...D}>
            <span {...D} className="block text-500 font-medium mb-3">
              {title}
            </span>{" "}
            <div {...D} className="text-900 font-medium text-xl">
              <NumberFormat value={value} decimal={decimal} /> {unit}
            </div>
            {children && <> {children}</>}
          </div>{" "}
          <div {...D} className={`flex align-items-center justify-content-center bg-${color}-100 border-round`} style={{ width: "2.5rem", height: "2.5rem" }}>
            <i {...D} className={`pi ${icon} text-${color}-500 text-xl`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

// "ฝาก 1,000.00 บาท · 1 รายการ (1 คน)" line of the member cards
type MoneyLineProps = { label: string; amount: number; count: number; members: number; first?: boolean };

export function MoneyLine({ label, amount, count, members, first }: MoneyLineProps) {
  return (
    <small {...D} className={first ? "block text-600 mt-2" : "block text-600"}>
      {label} <NumberFormat value={amount} decimal={2} /> {BAHT} · <NumberFormat value={count} decimal={0} /> {ITEMS} (
      <NumberFormat value={members} decimal={0} /> {PERSON})
    </small>
  );
}
