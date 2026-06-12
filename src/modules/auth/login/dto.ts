// src/modules/auth/login/dto.ts

export interface LoginRequestDto {
  emailAddress: string;
  passwordValue: string;
}

export interface OtpRequestDto {
  emailAddress: string;
  otpToken: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
}

export interface OtpResponseDto {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}