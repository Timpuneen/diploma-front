"use client";

/**
 * Client wrapper for register page with guest guard protection.
 */

import { GuestGuard } from "@/components/guest-guard";
import { RegisterForm } from "@/components/auth/register-form";

export function RegisterPageClient() {
  return (
    <GuestGuard>
      <RegisterForm />
    </GuestGuard>
  );
}
