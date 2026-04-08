"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

/**
 * Wraps the app with Google OAuth context when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.
 */
export function GoogleAuthBridge({ children }: { children: ReactNode }) {
  const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!id?.trim()) {
    return <>{children}</>;
  }
  return <GoogleOAuthProvider clientId={id.trim()}>{children}</GoogleOAuthProvider>;
}
