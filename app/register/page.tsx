/**
 * Register page — accessible only to unauthenticated users.
 */

import type { Metadata } from "next";
import { RegisterPageClient } from "./client";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
