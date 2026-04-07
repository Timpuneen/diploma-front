"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import type { SubscriptionStatus, UserLimits } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, Zap, Check, Loader2, AlertTriangle } from "lucide-react";

export default function BillingPage() {
  const { t } = useLocale();
  const [sub, setSub] = useState<SubscriptionStatus | null>(null);
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.getSubscriptionStatus(),
      apiClient.getUserLimits(),
    ])
      .then(([s, l]) => {
        setSub(s);
        setLimits(l);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade() {
    setCheckoutLoading(true);
    try {
      const { url } = await apiClient.createCheckoutSession();
      window.location.href = url;
    } catch {
      toast.error(t.billing.cancelSubtitle);
      setCheckoutLoading(false);
    }
  }

  async function handleManage() {
    setPortalLoading(true);
    try {
      const { url } = await apiClient.createPortalSession();
      window.location.href = url;
    } catch {
      toast.error(t.billing.cancelSubtitle);
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPremium = sub?.is_premium ?? false;
  const cancelAtEnd = sub?.cancel_at_period_end ?? false;
  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.billing.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.billing.subtitle}</p>
      </div>

      {cancelAtEnd && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {t.billing.cancelingAtEnd}
          {periodEnd && <span className="ml-1 font-medium">({periodEnd})</span>}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <Card className={`border-border/50 ${!isPremium ? "ring-2 ring-primary/50" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4" />
                {t.billing.freePlan}
              </CardTitle>
              {!isPremium && (
                <Badge variant="secondary">{t.billing.currentPlan}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-muted-foreground" />
              <span>{t.billing.dailyLimit}: <strong>10</strong> {t.billing.requests}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-muted-foreground" />
              <span>{t.billing.monthlyLimit}: <strong>100</strong> {t.billing.requests}</span>
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`border-primary/30 ${isPremium ? "ring-2 ring-primary/50" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="h-4 w-4 text-yellow-500" />
                {t.billing.premiumPlan}
              </CardTitle>
              {isPremium && (
                <Badge>{t.billing.currentPlan}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>{t.billing.dailyLimit}: <strong>100</strong> {t.billing.requests}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>{t.billing.monthlyLimit}: <strong>1000</strong> {t.billing.requests}</span>
            </div>

            {isPremium && periodEnd && !cancelAtEnd && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t.billing.activeTill}: {periodEnd}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col items-center gap-4">
        {isPremium ? (
          <Button
            size="lg"
            variant="outline"
            onClick={handleManage}
            disabled={portalLoading}
            className="gap-2"
          >
            {portalLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crown className="h-4 w-4" />
            )}
            {t.billing.manageSub}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleUpgrade}
            disabled={checkoutLoading}
            className="gap-2"
          >
            {checkoutLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crown className="h-4 w-4" />
            )}
            {t.billing.upgrade}
          </Button>
        )}
      </div>
    </div>
  );
}
