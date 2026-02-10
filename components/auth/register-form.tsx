"use client";

import React from "react"

/**
 * Registration form component with name, email, and password fields.
 * Integrates with AuthContext for user registration flow.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error(t("registerFillAll"));
      return;
    }

    if (password.length < 8) {
      toast.error(t("registerPasswordMin"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("registerPasswordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      toast.success(t("registerSuccess"));
      router.push(ROUTES.ANALYZE);
    } catch {
      toast.error(t("registerFailed"));
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
            {t("registerTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("registerSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("registerName")}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("registerNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="register-email">{t("registerEmail")}</Label>
            <Input
              id="register-email"
              type="email"
              placeholder={t("loginEmailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="register-password">{t("registerPassword")}</Label>
            <Input
              id="register-password"
              type="password"
              placeholder={t("registerPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">{t("registerConfirmPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder={t("registerConfirmPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("registerSubmitting")}
              </>
            ) : (
              t("registerSubmit")
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("registerHaveAccount")}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline"
          >
            {t("registerSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
