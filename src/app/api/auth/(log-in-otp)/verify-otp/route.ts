import { NextRequest, NextResponse } from "next/server";
import { OtpRequestDto } from "@/src/modules/auth/login/dto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body: OtpRequestDto = await request.json();

    if (!body.emailAddress || !body.otpToken) {
      return NextResponse.json(
        { success: false, message: "Email and OTP token are required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        email: body.emailAddress,
        token: body.otpToken,
        type: "email",
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data?.access_token) {
      return NextResponse.json({
        success: true,
        message: "Verification successful.",
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: data?.message ?? data?.error_description ?? "Invalid or expired OTP.",
      },
      { status: response.status || 401 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Network error. Please check your connection." },
      { status: 500 }
    );
  }
}