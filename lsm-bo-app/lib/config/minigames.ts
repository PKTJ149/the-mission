// Settings for the Minigames promo page (/minigames).

// Where "เปิดใช้บริการ" (turn on the service) sends the merchant. Opens in a new tab.
// TODO(PK): real LINE/contact link
export const MINIGAMES_CONTACT_URL = "https://line.me/";

// The real player-facing missions pages (wallet-app in this repo). The promo page's "ภารกิจ" demo
// shows them live in a phone frame. Locally wallet-app runs on port 3300 (launch config
// "wallet-app-3300"); set NEXT_PUBLIC_WALLET_APP_URL to its deployed URL elsewhere.
export const WALLET_APP_URL = process.env.NEXT_PUBLIC_WALLET_APP_URL ?? "http://localhost:3300";
