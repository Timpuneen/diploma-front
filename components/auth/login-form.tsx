"use client";

import React from "react";

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
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!login || !password) {
      toast.error(t.login.fillAll);
      return;
    }

    setIsSubmitting(true);

    try {
      await authLogin({ login, password });
      toast.success(t.login.welcomeBack);
      router.push(ROUTES.ANALYZE);
    } catch {
      setPassword("");
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
            <Label htmlFor="login">{t.login.username}</Label>
            <Input
              id="login"
              type="text"
              placeholder="Username or email"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.login.password}</Label>
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-primary hover:underline"
                tabIndex={-1}
              >
                {t.login.forgotPassword}
              </Link>
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

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ? (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
          ) : null}

          <GoogleSignInButton variant="login" />
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