"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const MAX_POLL_MS = 30_000;
const POLL_INTERVAL_MS = 2_000;

export default function BillingSuccessPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [timedOut, setTimedOut] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const polling = useRef(true);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(async () => {
      if (!polling.current) return;

      try {
        const sub = await apiClient.getSubscriptionStatus();
        if (sub.is_premium) {
          polling.current = false;
          setConfirmed(true);
          toast.success(t.billing.successTitle);
          setTimeout(() => router.push(ROUTES.BILLING), 1500);
          return;
        }
      } catch {
        // ignore transient errors
      }

      if (Date.now() - start > MAX_POLL_MS) {
        polling.current = false;
        setTimedOut(true);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      polling.current = false;
      clearInterval(interval);
    };
  }, [router, t]);

  return (
    <div className="flex items-center justify-center py-24 px-6">
      <Card className="w-full max-w-md border-border/50">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          {confirmed ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}

          <h2 className="text-xl font-bold text-foreground">
            {confirmed ? t.billing.successTitle : t.billing.processing}
          </h2>
          <p className="text-sm text-muted-foreground">
            {confirmed ? t.billing.successTitle : t.billing.successSubtitle}
          </p>

          {timedOut && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {t.billing.successSubtitle}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href={ROUTES.BILLING}>{t.billing.backToBilling}</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
