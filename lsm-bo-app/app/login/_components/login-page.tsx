"use client";
/* eslint-disable @next/next/no-img-element -- plain <img> for the brand logo, like the rest of the app */

import { MotionConfig } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { BannerCarousel } from "@/components/promo-banners/banner-carousel";
import styles from "./login.module.css";

// Mockup login: any (or no) username and password signs in and opens the dashboard.
export function LoginPage({ fontClassName }: { fontClassName: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // a short pause so the button's loading state is visible, like a real sign-in
    window.setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`${styles.page} ${fontClassName}`}>
        {/* Left: brand + the promo banners, auto-sliding */}
        <section className={styles.showcase} aria-label="Mini Games">
          <span className={styles.glowA} aria-hidden="true" />
          <span className={styles.glowB} aria-hidden="true" />
          <img className={styles.logo} src="/icon/AUTO-FAST-TRACK.png" width={1200} height={596} alt="AUTO FAST TRACK" />
          <div className={styles.slider}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              ใหม่! Mini Games &amp; Missions
            </p>
            <BannerCarousel onCta={() => router.push("/minigames-preview")} autoPlay intervalMs={4500} />
          </div>
        </section>

        {/* Right: sign-in form */}
        <section className={styles.formSide}>
          <form className={styles.card} onSubmit={onSubmit}>
            <span className={styles.demo}>
              <i className="pi pi-info-circle" aria-hidden="true" />
              โหมดตัวอย่าง: กดเข้าสู่ระบบได้ทันที
            </span>
            <h1 className={styles.title}>เข้าสู่ระบบ</h1>
            <p className={styles.sub}>LSM-SYSTEM · Back Office</p>

            <label className={styles.label} htmlFor="login-username">
              ชื่อผู้ใช้
            </label>
            <div className={styles.field}>
              <i className="pi pi-user" aria-hidden="true" />
              <input id="login-username" name="username" type="text" autoComplete="username" placeholder="username@merchant" />
            </div>

            <label className={styles.label} htmlFor="login-password">
              รหัสผ่าน
            </label>
            <div className={styles.field}>
              <i className="pi pi-lock" aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.eye}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                aria-pressed={showPassword}
              >
                <i className={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} aria-hidden="true" />
              </button>
            </div>

            <label className={styles.remember}>
              <input type="checkbox" name="remember" defaultChecked />
              จดจำฉันไว้ในเครื่องนี้
            </label>

            <button type="submit" className={styles.submit} disabled={loading} aria-busy={loading}>
              {loading ? (
                <>
                  <i className="pi pi-spin pi-spinner" aria-hidden="true" />
                  กำลังเข้าสู่ระบบ…
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <i className="pi pi-arrow-right" aria-hidden="true" />
                </>
              )}
            </button>

            <p className={styles.footnote}>V 1.0.0 · © LSM-SYSTEM</p>
          </form>
        </section>
      </div>
    </MotionConfig>
  );
}
