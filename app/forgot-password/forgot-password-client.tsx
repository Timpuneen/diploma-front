"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";

export function ForgotPasswordClient() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error(t.forgotPassword.fillEmail);
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.forgotPassword({ email: trimmed });
      setDone(true);
    } catch {
      toast.error(t.forgotPassword.requestError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href={ROUTES.HOME} className="mb-8 inline-flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
      </Link>

      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-foreground">
          {t.forgotPassword.title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t.forgotPassword.subtitle}
        </p>

        {done ? (
          <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
            <h2 className="text-lg font-semibold">{t.forgotPassword.successTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.forgotPassword.successBody}</p>
            <Button asChild className="mt-6">
              <Link href={ROUTES.LOGIN}>{t.forgotPassword.backToLogin}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t.forgotPassword.email}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.forgotPassword.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.forgotPassword.submitting}
                </>
              ) : (
                t.forgotPassword.submit
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
                {t.forgotPassword.backToLogin}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
