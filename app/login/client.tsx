"use client";

/**
 * Client wrapper for login page with guest guard protection.
 */

import { AuthProvider } from "@/lib/auth-context";
import { GuestGuard } from "@/components/guest-guard";
import { LoginForm } from "@/components/auth/login-form";

export function LoginPageClient() {
  return (
    <AuthProvider>
      <GuestGuard>
        <LoginForm />
      </GuestGuard>
    </AuthProvider>
  );
}
