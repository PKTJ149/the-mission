// Shared motion settings for the promo page.

// Strong ease-out for entrances and UI (same curve as the sidebar Minigames icon)
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// Lucky-wheel deceleration: fast start, long gentle settle over several turns
export const EASE_WHEEL = [0.12, 0.72, 0.16, 1] as const;

// A springy "pop" for rewards that should feel physical
export const POP_SPRING = { type: "spring", stiffness: 520, damping: 26, mass: 0.8 } as const;

// Small deterministic pseudo-random number in [0, 1), so confetti looks random but renders the same
// on the server and in the browser.
export function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
