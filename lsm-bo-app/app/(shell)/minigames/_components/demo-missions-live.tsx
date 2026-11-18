import { WALLET_APP_URL } from "@/lib/config/minigames";
import styles from "./demo-missions-live.module.css";

// "ภารกิจ" demo: the real player missions page (wallet-app /missions), live and playable inside a
// phone frame, instead of a mock. Tabs, cards and the mission detail pages all work in it.
export function DemoMissionsLive() {
  const src = `${WALLET_APP_URL}/missions`;
  return (
    <div className={styles.wrap}>
      <div className={styles.phone}>
        <span className={styles.notch} aria-hidden="true" />
        <iframe className={styles.screen} src={src} title="ตัวอย่างหน้าภารกิจของผู้เล่น" loading="lazy" />
      </div>
      <a className={styles.open} href={src} target="_blank" rel="noopener noreferrer">
        <i className="pi pi-external-link" aria-hidden="true" />
        เปิดหน้าภารกิจเต็มจอ
      </a>
    </div>
  );
}
