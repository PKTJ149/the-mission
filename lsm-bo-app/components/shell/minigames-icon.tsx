import styles from "./minigames-icon.module.css";

// Featured "Minigames" menu icon (our own addition, not in the original LSM-SYSTEM):
// a 3D-looking lucky wheel that spins, then turns into a mystery box that pops open, on a loop.
// Pure SVG + CSS (see minigames-icon.module.css). Only one instance exists, so the gradient ids are fixed.

const SEGMENT_COLORS = ["#FF4D8D", "#FFC93C", "#3BA3FF", "#19C3A6", "#8B5CF6", "#FF7A2F", "#22C55E", "#EF4444"];
const CENTER = 13;
const WHEEL_R = 9.6;

// One pie slice of the wheel, as an SVG path
function slice(index: number, count: number, radius: number) {
  const a0 = (index / count) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((index + 1) / count) * Math.PI * 2 - Math.PI / 2;
  const p = (a: number) => `${(CENTER + radius * Math.cos(a)).toFixed(3)} ${(CENTER + radius * Math.sin(a)).toFixed(3)}`;
  return `M${CENTER} ${CENTER} L${p(a0)} A${radius} ${radius} 0 0 1 ${p(a1)} Z`;
}

const BULBS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
  return { cx: +(CENTER + 11.1 * Math.cos(a)).toFixed(3), cy: +(CENTER + 11.1 * Math.sin(a)).toFixed(3) };
});

// 4-point sparkle centred on 0,0
const SPARK = "M0 -2.2 L0.6 -0.6 L2.2 0 L0.6 0.6 L0 2.2 L-0.6 0.6 L-2.2 0 L-0.6 -0.6 Z";

export function MinigamesIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      {/* Lucky wheel */}
      <svg className={`${styles.layer} ${styles.wheel}`} viewBox="0 0 26 26">
        <defs>
          <linearGradient id="mgx-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF1B8" />
            <stop offset="0.45" stopColor="#F5B800" />
            <stop offset="1" stopColor="#9A6200" />
          </linearGradient>
          <radialGradient id="mgx-shade" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="mgx-hub" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#FFFDF0" />
            <stop offset="1" stopColor="#E0A100" />
          </radialGradient>
          <linearGradient id="mgx-pointer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF6B6B" />
            <stop offset="1" stopColor="#B3001B" />
          </linearGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r="12" fill="url(#mgx-rim)" />
        <circle cx={CENTER} cy={CENTER} r="10.2" fill="#3A1D00" />
        <g className={styles.spin}>
          {SEGMENT_COLORS.map((color, i) => (
            <path key={color} d={slice(i, SEGMENT_COLORS.length, WHEEL_R)} fill={color} stroke="#fff" strokeWidth="0.4" />
          ))}
        </g>
        <circle cx={CENTER} cy={CENTER} r={WHEEL_R} fill="url(#mgx-shade)" />
        <ellipse cx="9.4" cy="8.2" rx="4.4" ry="2.4" fill="#fff" opacity="0.35" transform="rotate(-30 9.4 8.2)" />
        {BULBS.map((b) => (
          <circle key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} r="0.85" fill="#FFF8DC" />
        ))}
        <circle cx={CENTER} cy={CENTER} r="2.4" fill="url(#mgx-hub)" stroke="#9A6200" strokeWidth="0.5" />
        <path d="M10.6 0.4 L15.4 0.4 L13 5 Z" fill="url(#mgx-pointer)" stroke="#7A0010" strokeWidth="0.4" strokeLinejoin="round" />
      </svg>

      {/* Mystery box */}
      <svg className={`${styles.layer} ${styles.box}`} viewBox="0 0 26 26">
        <defs>
          <linearGradient id="mgx-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A874FF" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="mgx-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6D28D9" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>
          <linearGradient id="mgx-lid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D6BCFF" />
            <stop offset="1" stopColor="#A774FF" />
          </linearGradient>
          <linearGradient id="mgx-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE27A" />
            <stop offset="1" stopColor="#E0A100" />
          </linearGradient>
          <radialGradient id="mgx-glow" cx="0.5" cy="0.6" r="0.6">
            <stop offset="0" stopColor="#FFF6B0" />
            <stop offset="0.5" stopColor="#FFB300" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className={styles.boxBody}>
          {/* body: left and right faces */}
          <path d="M4 12 L13 16.5 L13 24.5 L4 20 Z" fill="url(#mgx-left)" />
          <path d="M13 16.5 L22 12 L22 20 L13 24.5 Z" fill="url(#mgx-right)" />
          <text x="8.5" y="16.3" transform="matrix(1 0.5 0 1 0 0)" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFE27A" stroke="#5B21B6" strokeWidth="0.3">
            ?
          </text>
          <text x="17.5" y="29.3" transform="matrix(1 -0.5 0 1 0 0)" textAnchor="middle" fontSize="7" fontWeight="700" fill="#FFE27A" stroke="#3B0F80" strokeWidth="0.3">
            ?
          </text>
          {/* the opening, lit up while the lid is off */}
          <path d="M4 12 L13 7.5 L22 12 L13 16.5 Z" fill="#2A0E66" />
          <g className={styles.glow}>
            <path d="M4 12 L13 7.5 L22 12 L13 16.5 Z" fill="url(#mgx-glow)" />
            <ellipse cx="13" cy="6.5" rx="7" ry="5.5" fill="url(#mgx-glow)" opacity="0.7" />
          </g>
          {/* lid with ribbon and bow */}
          <g className={styles.lid}>
            <path d="M3 10.2 L13 15.2 L13 17 L3 12 Z" fill="#8B5CF6" />
            <path d="M13 15.2 L23 10.2 L23 12 L13 17 Z" fill="#5B21B6" />
            <path d="M3 10.2 L13 5.2 L23 10.2 L13 15.2 Z" fill="url(#mgx-lid)" />
            <path d="M7.2 12.3 L17.2 7.3 L18.8 8.1 L8.8 13.1 Z" fill="url(#mgx-gold)" />
            <path d="M7.2 8.1 L8.8 7.3 L18.8 12.3 L17.2 13.1 Z" fill="url(#mgx-gold)" />
            <path d="M7.2 12.3 L8.8 13.1 L8.8 14.9 L7.2 14.1 Z" fill="#E0A100" />
            <path d="M17.2 13.1 L18.8 12.3 L18.8 14.1 L17.2 14.9 Z" fill="#B88400" />
            <ellipse cx="11.6" cy="9.3" rx="1.8" ry="1.1" fill="url(#mgx-gold)" transform="rotate(-25 11.6 9.3)" />
            <ellipse cx="14.4" cy="9.3" rx="1.8" ry="1.1" fill="url(#mgx-gold)" transform="rotate(25 14.4 9.3)" />
            <circle cx="13" cy="9.8" r="0.8" fill="#FFF1B8" />
          </g>
        </g>
        {/* sparkles that pop out of the box */}
        <g transform="translate(7.5 4)">
          <path className={styles.spark} d={SPARK} fill="#FFE27A" />
        </g>
        <g transform="translate(13 1.6)">
          <path className={`${styles.spark} ${styles.spark2}`} d={SPARK} fill="#fff" />
        </g>
        <g transform="translate(18.8 4.2)">
          <path className={`${styles.spark} ${styles.spark3}`} d={SPARK} fill="#FF9AD5" />
        </g>
      </svg>
    </span>
  );
}

export function MinigamesBadge() {
  return <span className={styles.badge}>NEW</span>;
}

export const featuredRowClass = styles.row;
export const featuredActiveClass = styles.rowActive;
