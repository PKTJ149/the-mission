// Whether this merchant has subscribed to Mini Games + Missions.
// The page calls this instead of reading a mock, so it can later become a real fetch() without
// touching the page.

export type MinigamesSubscription = { subscribed: boolean };

// Mock: this merchant has not subscribed yet, so /minigames shows the promo page.
export async function getMinigamesSubscription(): Promise<MinigamesSubscription> {
  return { subscribed: false };
}
