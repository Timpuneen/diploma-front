"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Shield, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  RESET_TOKEN_EXPIRED,
  RESET_TOKEN_INVALID,
  RESET_TOKEN_USED,
} from "@/lib/reset-token-codes";
import type { ApiError } from "@/lib/types";
import { toast } from "sonner";

type Phase =
  | "loading"
  | "form"
  | "no_token"
  | "invalid"
  | "expired"
  | "used"
  | "success";

function detailMessage(err: unknown): string {
  const e = err as ApiError;
  if (typeof e?.detail === "string") return e.detail;
  if (Array.isArray(e?.detail) && e.detail[0]?.msg) return e.detail.map((x) => x.msg).join(" ");
  return "";
}

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = searchParams.get("token")?.trim() ?? "";

  useEffect(() => {
    if (!token) {
      setPhase("no_token");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.validateResetToken(token);
        if (cancelled) return;
        if (res.valid) {
          setPhase("form");
          return;
        }
        switch (res.code) {
          case RESET_TOKEN_EXPIRED:
            setPhase("expired");
            break;
          case RESET_TOKEN_USED:
            setPhase("used");
            break;
          case RESET_TOKEN_INVALID:
          default:
            setPhase("invalid");
            break;
        }
      } catch {
        if (!cancelled) setPhase("invalid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirm) {
      toast.error(t.resetPassword.fillAll);
      return;
    }
    if (password !== confirm) {
      toast.error(t.resetPassword.passwordMismatch);
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.resetPassword({ token, password });
      setPhase("success");
    } catch (err) {
      const msg = detailMessage(err);
      const code = (err as ApiError)?.code;
      if (code === RESET_TOKEN_EXPIRED) setPhase("expired");
      else if (code === RESET_TOKEN_USED) setPhase("used");
      else if (code === RESET_TOKEN_INVALID) setPhase("invalid");
      else if (msg) toast.error(msg);
      else toast.error(t.resetPassword.resetError);
    } finally {
      setSubmitting(false);
    }
  }

  const deadEndCopy = (key: "invalid" | "expired" | "used" | "no_token") => {
    const map = {
      no_token: { title: t.resetPassword.noTokenTitle, body: t.resetPassword.noTokenBody },
      invalid: { title: t.resetPassword.invalidTitle, body: t.resetPassword.invalidBody },
      expired: { title: t.resetPassword.expiredTitle, body: t.resetPassword.expiredBody },
      used: { title: t.resetPassword.usedTitle, body: t.resetPassword.usedBody },
    } as const;
    return map[key];
  };

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
              <p className="text-muted-foreground">{t.resetPassword.loading}</p>
            </motion.div>
          )}

          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-left"
            >
              <h1 className="text-center text-xl font-semibold">{t.resetPassword.title}</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {t.resetPassword.subtitleValid}
              </p>
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="npw">{t.resetPassword.password}</Label>
                  <Input
                    id="npw"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t.resetPassword.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cpw">{t.resetPassword.confirmPassword}</Label>
                  <Input
                    id="cpw"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t.resetPassword.confirmPlaceholder}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" disabled={submitting} className="mt-2">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.resetPassword.submitting}
                    </>
                  ) : (
                    t.resetPassword.submit
                  )}
                </Button>
              </form>
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
              <h1 className="text-xl font-semibold">{t.resetPassword.successTitle}</h1>
              <p className="text-sm text-muted-foreground">{t.resetPassword.successBody}</p>
              <Button asChild className="mt-2">
                <Link href={ROUTES.LOGIN}>{t.resetPassword.goLogin}</Link>
              </Button>
            </motion.div>
          )}

          {(phase === "no_token" || phase === "invalid" || phase === "expired" || phase === "used") && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              <XCircle className="h-12 w-12 text-destructive" />
              <h1 className="text-xl font-semibold">
                {deadEndCopy(phase === "no_token" ? "no_token" : phase).title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {deadEndCopy(phase === "no_token" ? "no_token" : phase).body}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={ROUTES.FORGOT_PASSWORD}>{t.resetPassword.requestNewLink}</Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.LOGIN}>{t.resetPassword.goLogin}</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
