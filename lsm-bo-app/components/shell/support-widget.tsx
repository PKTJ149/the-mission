// LazySupportWidget (data-v-6d761b76): the green chat button in the bottom-right corner
// with the red "replied" label and count badge.
const W = { "data-v-6d761b76": "" };

export function SupportWidget({ repliedCount }: { repliedCount: number }) {
  return (
    <div {...W} data-v-4a0b3382="" className="sw">
      {"   "}
      {/* ORIGINAL: clicking the label or the button opens the support chat panel (marks messages read) */}
      <span {...W} className="sw-fab-lbl">
        {`\n    ซัพพอร์ตตอบแล้ว ${repliedCount} ข้อความ\n  `}
      </span>{" "}
      <button {...W} aria-label="ศูนย์ช่วยเหลือ" className="sw-fab sw-ring">
        <svg
          {...W}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="sw-fab-ic"
        >
          <path {...W} d="M17.65 18.51A5.5 5.5 0 1 1 19.67 15.88L20.5 20z"></path>{" "}
          <path {...W} d="M4.36 11.55A6 6 0 1 1 6.56 14.41L3.5 16z" className="sw-fab-ic-front"></path>
        </svg>{" "}
        <span {...W} className="sw-bdg">
          {repliedCount}
        </span>
      </button>{" "}
    </div>
  );
}
