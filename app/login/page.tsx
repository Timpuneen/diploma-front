/**
 * Login page — accessible only to unauthenticated users.
 */

import type { Metadata } from "next";
import { LoginPageClient } from "./client";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
