"use client";

/**
 * Dashboard banner when the user is logged in but email is not verified yet.
 */

import { useState } from "react";
import { MailWarning, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [pending, setPending] = useState(false);

  if (!user || user.is_verified) {
    return null;
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-3"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-amber-100">
            <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
            {t.verifyEmail.banner}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-500/50 bg-transparent hover:bg-amber-500/20"
            disabled={pending}
            onClick={handleResend}
          >
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
    </AnimatePresence>
  );
}
