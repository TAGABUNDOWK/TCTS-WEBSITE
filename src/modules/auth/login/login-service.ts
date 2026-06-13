// src/modules/auth/login/login-service.ts

import { LoginRequestDto, LoginResponseDto, OtpRequestDto, OtpResponseDto } from "./dto";

// ─────────────────────────────────────────────
// Step 1 — Send OTP to email via API route
// Calls /api/auth/send-otp server endpoint
// ─────────────────────────────────────────────
export async function sendLoginOtp(
  dto: LoginRequestDto
): Promise<LoginResponseDto> {
  try {
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return {
        success: true,
        message: data.message ?? "OTP sent. Please check your email.",
      };
    }

    return {
      success: false,
      message: data.message ?? "Failed to send OTP. Please try again.",
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}


// ─────────────────────────────────────────────
// Step 2 — Verify the OTP token via API route
// Calls /api/auth/verify-otp server endpoint
// ─────────────────────────────────────────────
export async function verifyLoginOtp(
  dto: OtpRequestDto
): Promise<OtpResponseDto> {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data?.accessToken) {
      return {
        success: true,
        message: "Verification successful.",
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    }

    return {
      success: false,
      message: data?.message ?? "Invalid or expired OTP.",
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}