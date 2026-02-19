"use client";

/**
 * Client wrapper for login page with guest guard protection.
 */

import { GuestGuard } from "@/components/guest-guard";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPageClient() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  );
}