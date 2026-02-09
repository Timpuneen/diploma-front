"use client";

/**
 * Client wrapper for register page with guest guard protection.
 */

import { AuthProvider } from "@/lib/auth-context";
import { GuestGuard } from "@/components/guest-guard";
import { RegisterForm } from "@/components/auth/register-form";

export function RegisterPageClient() {
  return (
    <AuthProvider>
      <GuestGuard>
        <RegisterForm />
      </GuestGuard>
    </AuthProvider>
  );
}
