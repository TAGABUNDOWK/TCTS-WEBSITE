import { NextRequest, NextResponse } from "next/server";
import { LoginRequestDto } from "@/src/modules/auth/login/dto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestDto = await request.json();

    if (!body.emailAddress || !body.passwordValue) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // ── Step 1: Validate credentials ──────────────────────────────
    const credentialCheck = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          email: body.emailAddress,
          password: body.passwordValue,
        }),
      }
    );

    if (!credentialCheck.ok) {
      return NextResponse.json(
        { success: false, message: "Email or password is incorrect." },
        { status: 401 }
      );
    }

    // ── Step 2: Credentials valid → send OTP ─────────────────────
    const otpResponse = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        email: body.emailAddress,
        create_user: false,
        options: {
          shouldCreateUser: false,
        },
      }),
    });

    if (otpResponse.status === 204 || otpResponse.ok) {
      return NextResponse.json({
        success: true,
        message: "OTP sent to your email. Please check your inbox.",
      });
    }

    const errorData = await otpResponse.json().catch(() => ({}));
    return NextResponse.json(
      {
        success: false,
        message: errorData?.message ?? "Failed to send OTP. Please try again.",
      },
      { status: otpResponse.status }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Network error. Please check your connection." },
      { status: 500 }
    );
  }
}