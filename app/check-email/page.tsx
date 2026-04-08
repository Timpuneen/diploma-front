"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { apiClient } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CheckEmailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && user?.is_verified) {
      router.replace(ROUTES.ANALYZE);
    }
  }, [isLoading, user, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  async function handleResend() {
    setPending(true);
    try {
      await apiClient.resendVerification();
      toast.success(t.verifyEmail.resent);
    } catch {
      toast.error(t.verifyEmail.resendError);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <Link href={ROUTES.HOME} className="mb-8 inline-flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{t.verifyEmail.checkTitle}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t.verifyEmail.checkSubtitle}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild>
            <Link href={ROUTES.DASHBOARD}>{t.verifyEmail.goToDashboard}</Link>
          </Button>
          <Button type="button" disabled={pending} onClick={handleResend}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.verifyEmail.resending}
              </>
            ) : (
              t.verifyEmail.resend
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
