"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Shield, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { ROUTES } from "@/lib/constants";
import type { ApiError } from "@/lib/types";

type Phase = "loading" | "success" | "error";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLocale();
  const { refreshUser } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");

  const token = searchParams.get("token")?.trim() ?? "";

  useEffect(() => {
    if (!token) {
      setPhase("error");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await apiClient.verifyEmail(token);
        if (cancelled) return;
        const hasToken =
          typeof document !== "undefined" &&
          document.cookie.split("; ").some((row) => row.startsWith("auth_token="));
        if (hasToken) {
          await refreshUser();
        }
        setPhase("success");
      } catch (err) {
        if (cancelled) return;
        const detail = (err as ApiError)?.detail;
        console.error(
          "verify-email failed",
          typeof detail === "string" ? detail : err
        );
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, refreshUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href={ROUTES.HOME} className="mb-8 inline-flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
      </Link>

      <div className="w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">{t.verifyEmail.loading}</p>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h1 className="text-xl font-semibold">{t.verifyEmail.successTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {t.verifyEmail.successSubtitle}
              </p>
              <Button className="mt-2" onClick={() => router.push(ROUTES.ANALYZE)}>
                {t.verifyEmail.goAnalyze}
              </Button>
            </motion.div>
          )}

          {phase === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              <XCircle className="h-12 w-12 text-destructive" />
              <h1 className="text-xl font-semibold">{t.verifyEmail.invalidTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {t.verifyEmail.invalidSubtitle}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={ROUTES.DASHBOARD}>{t.verifyEmail.goToDashboard}</Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.LOGIN}>{t.verifyEmail.loginPrompt}</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
