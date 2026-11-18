import { NumberFormat } from "@/components/primevue/number-format";
import type { WalletPayment } from "@/lib/api/dashboard";
import { BAHT, D } from "./cards";

const MAINTENANCE = "ปิดปรับปรุง";
const FEE_LINE = { fontSize: "16px" };
const LIMIT_LINE = { fontSize: "18px" };
const BLACK = { color: "black" };

const isOne2Coin = (p: WalletPayment) => p.provider.toUpperCase().includes("ONE2COIN");
const amount = (value: string) => (value === "n/a" ? 0 : value);

// formatFeeWithdraw(): whole numbers (and 0.1) without decimals, anything else with one
function feeWithdrawDecimals(value: string) {
  const n = parseFloat(value);
  return n === 0.1 || Number.isInteger(n) ? 0 : 1;
}

// "ฝาก : ขั้นต่ำ 1,000 บาท / สูงสุด 200,000 บาท", or "ฝาก : ปิดปรับปรุง", or nothing (OneSlip)
function LimitLine({ label, open, min, max, minStyle }: { label: string; open: 0 | 1 | null; min: string; max: string; minStyle: object }) {
  if (open === 1) {
    return (
      <span {...D} className="block font-medium" style={LIMIT_LINE}>
        <span {...D} className="limit-part">
          {`${label} : ขั้นต่ำ `}
          <NumberFormat value={amount(min)} decimal={0} style={minStyle} />
          {" "}
          <span {...D} style={BLACK}>
            {BAHT}
          </span>
        </span>{" "}
        <span {...D} className="limit-part">
          {"/ สูงสุด "}
          <NumberFormat value={amount(max)} decimal={0} style={LIMIT_LINE} />
          {" "}
          <span {...D} style={BLACK}>
            {BAHT}
          </span>
        </span>
      </span>
    );
  }
  if (open === 0) {
    return (
      <span {...D} className="block font-medium" style={LIMIT_LINE}>
        <span {...D} className="inline-flex items-center">
          {`\n                                                    ${label} :  `}
          <span {...D} className="text-red-500">
            {MAINTENANCE}
          </span>
        </span>
      </span>
    );
  }
  return null;
}

// One payment-gateway account card ("บัญชีเพย์เมนต์เกตเวย์")
export function ProviderCard({ provider: p }: { provider: WalletPayment }) {
  const bothClosed = p.is_open_deposit === 0 && p.is_open_withdraw === 0;
  const one2coin = isOne2Coin(p);

  return (
    <div {...D}>
      <div {...D} className="surface-card shadow-2 p-3 border-1 border-50 border-round h-full flex flex-column">
        <div {...D} className="flex mb-3 w-full">
          <div {...D} className="w-full">
            <div {...D} className="flex justify-between">
              <div {...D} className={one2coin ? "flex-none mr-2" : "flex-none mr-2 w-40"}>
                <span {...D} className="flex align-items-center flex-wrap font-medium" style={{ fontSize: "18px", gap: "6px" }}>
                  <span {...D} className={`rounded-lg px-1 ${bothClosed ? "bg-red-500" : "bg-cyan-100"}`}>
                    {p.provider === "2MTPAY" ? "MTPAY PLUS" : p.provider}
                  </span>{" "}
                  {/* ORIGINAL: One2Coin cards show a red "N เอเยนต์ต้องเติมเงิน" link here when agents run low (0 now) */}
                </span>
              </div>{" "}
              <div {...D} className="flex-1">
                {bothClosed && (
                  <span {...D} style={{ fontSize: "18px", color: "red" }}>
                    <span {...D} className="bg-gray-800 rounded-md px-1">
                      {MAINTENANCE}
                    </span>
                  </span>
                )}
                {p.is_open_deposit === 1 && p.is_open_withdraw === 0 && (
                  <span {...D} style={{ fontSize: "18px", color: "red" }}>
                    <span {...D} className="rounded-md px-1">
                      ปิดปรับปรุงการถอน
                    </span>
                  </span>
                )}
                {p.is_open_deposit === 0 && p.is_open_withdraw === 1 && (
                  <span {...D} style={{ fontSize: "18px", color: "red" }}>
                    <span {...D} className="rounded-md px-1">
                      ปิดปรับปรุงการฝาก
                    </span>
                  </span>
                )}{" "}
              </div>
            </div>{" "}
            <div {...D} className="flex justify-between">
              <div {...D} className="flex-1">
                <span {...D} className="block font-medium" style={FEE_LINE}>
                  {" ค่าธรรมเนียม"}
                </span>{" "}
                <span {...D} className="block" style={FEE_LINE}>
                  <span {...D} className="text-800">
                    {"ฝาก  "}
                  </span>
                  {" :\n                                                "}
                  <NumberFormat value={p.fee_deposit} decimal={2} style={BLACK} />
                  {" %\n                                            "}
                </span>{" "}
                <span {...D} className="block" style={FEE_LINE}>
                  <span {...D} className="text-800">
                    ถอน
                  </span>
                  {"   : \n                                                "}
                  <NumberFormat value={p.fee_withdraw} decimal={feeWithdrawDecimals(p.fee_withdraw)} style={BLACK} />
                  {` \n                                                ${p.provider === "LSMJONE PAY" ? "บาท/ครั้ง" : "%"}\n                                            `}
                </span>{" "}
                <span {...D} className="block" style={FEE_LINE}>
                  <span {...D} className="text-800">
                    {`ค่าธรรมเนียมฝากคงที่ : ${p.fee_constant_deposit}`}
                  </span>
                </span>{" "}
                <span {...D} className="block" style={FEE_LINE}>
                  <span {...D} className="text-800">
                    {`ค่าธรรมเนียมถอนคงที่ : ${p.fee_constant_withdraw}`}
                  </span>
                </span>
              </div>{" "}
              <div {...D} className="flex-1" style={{ lineHeight: "77px" }}>
                <span {...D} className="text-black bg-yellow-200 px-1 rounded-lg" style={{ fontSize: "28px", whiteSpace: "nowrap" }}>
                  <NumberFormat value={amount(p.balance)} decimal={2} />
                  {`\n                                                ${BAHT}\n                                            `}
                </span>{" "}
                {one2coin && (
                  <div {...D} className="o2c-sum-caption">
                    <span {...D}>ยอดรวมทุกเอเยนต์ ·</span>{" "}
                    {/* ORIGINAL: opens the "ยอดคงเหลือ One2Coin รายเอเยนต์" dialog */}
                    <a {...D} href="#" className="o2c-view-link" onClick={(e) => e.preventDefault()}>
                      ดูรายเอเยนต์ <i {...D} className="pi pi-angle-right"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>{" "}
        <div {...D} className="flex">
          <div {...D} className="flex-1">
            <LimitLine label="ฝาก" open={p.is_open_deposit} min={p.min_deposit} max={p.max_deposit} minStyle={LIMIT_LINE} />{" "}
            <LimitLine label="ถอน" open={p.is_open_withdraw} min={p.min_withdraw} max={p.max_withdraw} minStyle={{ color: "black", fontSize: "18px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
