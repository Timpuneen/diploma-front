"use client";

import React from "react"

/**
 * Login form component with email/password fields and validation.
 * Integrates with AuthContext for authentication flow.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t.login.fillAll);
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success(t.login.welcomeBack);
      router.push(ROUTES.ANALYZE);
    } catch {
      toast.error(t.login.invalidCredentials);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            {t.login.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.login.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t.login.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t.login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.login.password}</Label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                tabIndex={-1}
              >
                {t.login.forgotPassword}
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t.login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.login.submitting}
              </>
            ) : (
              t.login.submit
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.login.noAccount}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-primary hover:underline"
          >
            {t.login.signUp}
          </Link>
        </p>
      </div>
    </div>
  );
}
