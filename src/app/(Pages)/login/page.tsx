"use client";

import { useState, useEffect, useRef } from "react";
import { LoginRequestDto, OtpRequestDto } from "@/src/modules/auth/login/dto";
import { sendLoginOtp, verifyLoginOtp } from "@/src/modules/auth/login/login-service";

type LoginStep = "credentials" | "otp";
type StatusType = "idle" | "loading" | "error" | "success";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("credentials");
  const [formData, setFormData] = useState<LoginRequestDto>({ emailAddress: "", passwordValue: "" });
  const [otpData, setOtpData] = useState<OtpRequestDto>({ emailAddress: "", otpToken: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<StatusType>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (showOtpModal) {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [showOtpModal]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startResendCooldown = () => {
    setOtpResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setOtpResendCooldown((prev: number) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (fieldName: keyof LoginRequestDto, inputValue: string) => {
    setFormData((prev: LoginRequestDto) => ({ ...prev, [fieldName]: inputValue }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleOtpChange = (inputValue: string) => {
    const sanitized = inputValue.replace(/\D/g, "").slice(0, 6);
    setOtpData((prev: OtpRequestDto) => ({ ...prev, otpToken: sanitized }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleLoginSubmit = async () => {
    setErrorMessage("");
    if (!formData.emailAddress || !formData.passwordValue) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    const result = await sendLoginOtp(formData);
    if (result.success) {
      setOtpData({ emailAddress: formData.emailAddress, otpToken: "" });
      setStep("otp");
      setShowOtpModal(true);
      setStatus("idle");
      startResendCooldown();
    } else {
      setStatus("error");
      setErrorMessage(result.message);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpData.otpToken.length !== 6) {
      setStatus("error");
      setErrorMessage("Please enter the full 6-digit code.");
      return;
    }
    setStatus("loading");
    const result = await verifyLoginOtp(otpData);
    if (result.success) {
      setStatus("success");
      console.info("Session established:", result.accessToken ? "token received" : "no token");
    } else {
      setStatus("error");
      setErrorMessage(result.message);
    }
  };

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) return;
    setStatus("loading");
    setErrorMessage("");
    const result = await sendLoginOtp(formData);
    if (result.success) {
      setStatus("idle");
      setOtpData((prev: OtpRequestDto) => ({ ...prev, otpToken: "" }));
      startResendCooldown();
    } else {
      setStatus("error");
      setErrorMessage(result.message);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setStep("credentials");
    setStatus("idle");
    setErrorMessage("");
    setOtpData({ emailAddress: "", otpToken: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (step === "credentials") handleLoginSubmit();
      else handleOtpSubmit();
    }
  };

  if (!mounted) return null;

  const isLoading = status === "loading";

  // ── Light green palette ──────────────────────────────────────────
  // Primary accent:   #22c55e  (green-500)
  // Light accent:     #4ade80  (green-400)
  // Soft accent:      #86efac  (green-300)
  // Panel bg:         #f0fdf4 → #dcfce7 → #bbf7d0 gradient
  // Panel text:       #14532d  (green-900) for contrast on light bg
  // Page bg:          #f7fef9 → #ecfdf5 → #d1fae5 (very light green tones)
  // ────────────────────────────────────────────────────────────────

  return (
    <div style={{
      width: "100vw", minHeight: "100dvh",
      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 70%, #ecfdf5 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>

      {/* Background orbs — lighter, softer */}
      <div style={{ position: "fixed", top: "-150px", left: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.25) 0%, rgba(34,197,94,0.10) 55%, transparent 75%)", animation: "float 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-120px", right: "-120px", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(134,239,172,0.22) 0%, rgba(74,222,128,0.08) 55%, transparent 75%)", animation: "float 11s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

      {/* OTP Modal */}
      {showOtpModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(20,83,45,0.35)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
          animation: "fadeIn 0.2s ease",
        }}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseOtpModal(); }}
        >
          <div style={{
            background: "#ffffff", borderRadius: "24px", padding: "40px 36px",
            width: "100%", maxWidth: "420px",
            boxShadow: "0 32px 64px rgba(20,83,45,0.18), 0 0 0 1px rgba(74,222,128,0.25)",
            animation: "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)",
            position: "relative",
          }}>
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseOtpModal}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "none", border: "none", cursor: "pointer",
                color: "#9ca3af", display: "flex", alignItems: "center",
                justifyContent: "center", padding: "6px", borderRadius: "8px",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#16a34a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#9ca3af"; }}
              aria-label="Close OTP modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* OTP icon */}
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
              border: "1px solid #86efac",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "20px",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 700, color: "#0a0a0a", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
              Check your email
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 28px", lineHeight: 1.6 }}>
              We sent a 6-digit verification code to{" "}
              <span style={{ color: "#111827", fontWeight: 600 }}>{otpData.emailAddress}</span>
            </p>

            {status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "11px 14px", marginBottom: "16px", animation: "shake 0.4s ease" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>{errorMessage}</span>
              </div>
            )}

            {status === "success" && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "11px 14px", marginBottom: "16px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 500 }}>Verified! Redirecting to dashboard...</span>
              </div>
            )}

            {/* OTP input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }} htmlFor="otpToken">
                Verification Code
              </label>
              <input
                ref={otpInputRef}
                id="otpToken"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otpData.otpToken}
                onChange={(e) => handleOtpChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="000000"
                disabled={isLoading || status === "success"}
                style={{
                  width: "100%", height: "56px", padding: "0 20px",
                  border: `1.5px solid ${status === "error" ? "#fca5a5" : "rgba(0,0,0,0.12)"}`,
                  borderRadius: "12px", fontSize: "24px", fontWeight: 600,
                  color: "#111827", background: status === "error" ? "#fff5f5" : "#f9fafb",
                  outline: "none", fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "10px", textAlign: "center",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.2)"; e.currentTarget.style.background = "#ffffff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = status === "error" ? "#fca5a5" : "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = status === "error" ? "#fff5f5" : "#f9fafb"; }}
              />
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={isLoading || status === "success" || otpData.otpToken.length !== 6}
              style={{
                width: "100%", height: "50px",
                background: otpData.otpToken.length === 6 && status !== "success"
                  ? "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)"
                  : "#e5e7eb",
                color: otpData.otpToken.length === 6 && status !== "success" ? "#ffffff" : "#9ca3af",
                border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                cursor: isLoading || status === "success" || otpData.otpToken.length !== 6 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: otpData.otpToken.length === 6 ? "0 4px 20px rgba(34,197,94,0.3)" : "none",
                marginBottom: "16px",
              }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ width: "15px", height: "15px", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#ffffff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Verifying...
                </span>
              ) : status === "success" ? "Verified ✓" : "Verify Code"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280" }}>
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpResendCooldown > 0 || isLoading}
                style={{
                  background: "none", border: "none", padding: 0,
                  cursor: otpResendCooldown > 0 || isLoading ? "not-allowed" : "pointer",
                  fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  color: otpResendCooldown > 0 ? "#9ca3af" : "#22c55e",
                  transition: "color 0.15s",
                }}
              >
                {otpResendCooldown > 0 ? `Resend in ${otpResendCooldown}s` : "Resend"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Main card */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: isMobile ? "100%" : "min(900px, 95vw)",
        minHeight: isMobile ? "100dvh" : "auto",
        borderRadius: isMobile ? "0" : "28px",
        overflow: "hidden",
        boxShadow: isMobile ? "none" : "0 48px 96px rgba(20,83,45,0.15), 0 0 0 1px rgba(74,222,128,0.3)",
        position: "relative", zIndex: 1,
        animation: "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both",
      }}>

        {/* Left branding panel — light green gradient */}
        <div style={{
          flex: isMobile ? "0 0 auto" : "0 0 340px",
          background: "linear-gradient(155deg, #bbf7d0 0%, #86efac 30%, #4ade80 65%, #22c55e 100%)",
          padding: isMobile ? "40px 32px 36px" : "56px 44px",
          display: "flex", flexDirection: "column", gap: "22px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Subtle dot pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

          {/* Logo mark */}
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <polygon points="24,4 44,16 44,32 24,44 4,32 4,16" fill="none" stroke="white" strokeWidth="2.5" />
              <polygon points="24,12 36,19 36,29 24,36 12,29 12,19" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="4" fill="white" />
            </svg>
          </div>

          <div>
            {/* Use dark green text on light panel for contrast */}
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? "22px" : "26px", fontWeight: 700, color: "#14532d", lineHeight: 1.2, letterSpacing: "-0.5px", margin: 0 }}>GreenLeaf Academy</h1>
            <p style={{ fontSize: "12px", color: "rgba(20,83,45,0.65)", marginTop: "6px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>Shaping Tomorrow&apos;s Leaders</p>
          </div>

          <div style={{ width: "36px", height: "2px", background: "rgba(20,83,45,0.25)", borderRadius: "2px" }} />

          {!isMobile && (
            <p style={{ fontSize: "14px", color: "rgba(20,83,45,0.7)", lineHeight: 1.75, margin: 0 }}>
              Secure administrative access for authorized personnel only. All activity is monitored and logged.
            </p>
          )}

          {/* System Online badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "100px", padding: "6px 14px", fontSize: "12px", color: "#14532d", fontWeight: 600, marginTop: isMobile ? "0" : "auto", width: "fit-content" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 8px rgba(22,163,74,0.6)", flexShrink: 0, animation: "pulse 2s ease-in-out infinite" }} />
            System Online
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ flex: 1, background: "#ffffff", padding: isMobile ? "40px 28px 48px" : "56px 52px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Admin Portal badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "18px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Admin Portal
            </div>

            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? "26px" : "32px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 8px" }}>Welcome back</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 32px", lineHeight: 1.5 }}>Sign in to access the admin dashboard</p>

            {/* Error banner */}
            {status === "error" && step === "credentials" && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", animation: "shake 0.4s ease" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>{errorMessage}</span>
              </div>
            )}

            {/* Email field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }} htmlFor="emailAddress">Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "14px", color: "#9ca3af", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </span>
                <input
                  id="emailAddress" type="email" value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="admin@school.edu" autoComplete="email"
                  style={{ width: "100%", height: "50px", padding: "0 16px 0 44px", border: `1.5px solid ${status === "error" ? "#fca5a5" : "rgba(0,0,0,0.11)"}`, borderRadius: "12px", fontSize: "14px", color: "#111827", background: status === "error" ? "#fff5f5" : "#f9fafb", outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.2)"; e.currentTarget.style.background = "#ffffff"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = status === "error" ? "#fca5a5" : "rgba(0,0,0,0.11)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = status === "error" ? "#fff5f5" : "#f9fafb"; }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }} htmlFor="passwordValue">Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "14px", color: "#9ca3af", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  id="passwordValue" type={showPassword ? "text" : "password"} value={formData.passwordValue}
                  onChange={(e) => handleInputChange("passwordValue", e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="Enter your password" autoComplete="current-password"
                  style={{ width: "100%", height: "50px", padding: "0 48px 0 44px", border: `1.5px solid ${status === "error" ? "#fca5a5" : "rgba(0,0,0,0.11)"}`, borderRadius: "12px", fontSize: "14px", color: "#111827", background: status === "error" ? "#fff5f5" : "#f9fafb", outline: "none", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,222,128,0.2)"; e.currentTarget.style.background = "#ffffff"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = status === "error" ? "#fca5a5" : "rgba(0,0,0,0.11)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = status === "error" ? "#fff5f5" : "#f9fafb"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", borderRadius: "6px" }} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "28px" }}>
              <button type="button" onClick={() => alert("Password reset link sent to your email.")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#22c55e", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", padding: 0, transition: "color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#16a34a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#22c55e"; }}>
                Forgot your password?
              </button>
            </div>

            {/* Submit button — light green gradient */}
            <button
              type="button" onClick={handleLoginSubmit} disabled={isLoading}
              style={{ width: "100%", height: "52px", background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: isLoading ? "not-allowed" : "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 24px rgba(34,197,94,0.35)", opacity: isLoading ? 0.85 : 1, letterSpacing: "0.2px" }}
              onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.45)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(34,197,94,0.35)"; }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#ffffff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Sending OTP...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              )}
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "32px", lineHeight: 1.5 }}>
            &copy; {new Date().getFullYear()} GreenLeaf Academy &mdash; Authorized access only
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-24px) scale(1.04); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #f9fafb inset !important; -webkit-text-fill-color: #111827 !important; }
      `}</style>
    </div>
  );
}