"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import type { ApiError, SubscriptionStatus } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries/ru";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Crown, Zap, Check, Loader2, AlertTriangle } from "lucide-react";

function billingErrorToastMessage(tb: Dictionary["billing"], err: unknown): string {
  const e = err as ApiError;
  const code = e?.code;
  if (code === "NO_ACTIVE_SUBSCRIPTION") return tb.errNoActiveSubscription;
  if (code === "SUBSCRIPTION_NOT_FOUND") return tb.errSubscriptionNotFound;
  if (code === "CANCELLATION_NOT_SCHEDULED") return tb.errCancellationNotScheduled;
  if (code === "STRIPE_NOT_CONFIGURED") return tb.errStripeNotConfigured;
  if (code === "STRIPE_REQUEST_FAILED") return tb.errStripeFailed;
  const detail = e?.detail;
  if (typeof detail === "string" && detail.length > 0) return detail;
  return tb.errGeneric;
}

export default function BillingPage() {
  const { t } = useLocale();
  const [sub, setSub] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const loadBilling = useCallback(async () => {
    const [s] = await Promise.all([
      apiClient.getSubscriptionStatus(),
      apiClient.getUserLimits(),
    ]);
    setSub(s);
  }, []);

  useEffect(() => {
    loadBilling()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [loadBilling]);

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

  async function handleConfirmCancel() {
    setCancelLoading(true);
    try {
      const res = await apiClient.cancelSubscription();
      if (res.already_scheduled) {
        toast.success(t.billing.cancelAlreadyScheduled);
      } else {
        toast.success(t.billing.cancelSuccess);
      }
      if (res.sync_pending) {
        toast.message(t.billing.syncPending);
      }
      await loadBilling();
      if (res.sync_pending) {
        setTimeout(() => {
          void loadBilling();
        }, 2000);
      }
      setCancelDialogOpen(false);
    } catch (err) {
      toast.error(billingErrorToastMessage(t.billing, err));
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleResume() {
    setResumeLoading(true);
    try {
      const res = await apiClient.resumeSubscription();
      toast.success(t.billing.resumeSuccess);
      if (res.sync_pending) {
        toast.message(t.billing.syncPending);
      }
      await loadBilling();
      if (res.sync_pending) {
        setTimeout(() => {
          void loadBilling();
        }, 2000);
      }
    } catch (err) {
      toast.error(billingErrorToastMessage(t.billing, err));
    } finally {
      setResumeLoading(false);
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

  const status = sub?.status;
  const activeLike =
    status === "active" ||
    status === "trialing" ||
    (status == null && isPremium);

  const canCancel = isPremium && !cancelAtEnd && activeLike;
  const canResume = isPremium && cancelAtEnd && activeLike;

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
        <Card className={`border-border/50 ${!isPremium ? "ring-2 ring-primary/50" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4" />
                {t.billing.freePlan}
              </CardTitle>
              {!isPremium && <Badge variant="secondary">{t.billing.currentPlan}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-muted-foreground" />
              <span>
                {t.billing.dailyLimit}: <strong>10</strong> {t.billing.requests}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-muted-foreground" />
              <span>
                {t.billing.monthlyLimit}: <strong>100</strong> {t.billing.requests}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-primary/30 ${isPremium ? "ring-2 ring-primary/50" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="h-4 w-4 text-yellow-500" />
                {t.billing.premiumPlan}
              </CardTitle>
              {isPremium && <Badge>{t.billing.currentPlan}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>
                {t.billing.dailyLimit}: <strong>100</strong> {t.billing.requests}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>
                {t.billing.monthlyLimit}: <strong>1000</strong> {t.billing.requests}
              </span>
            </div>

            {isPremium && periodEnd && !cancelAtEnd && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t.billing.activeTill}: {periodEnd}
              </p>
            )}
            {isPremium && periodEnd && cancelAtEnd && (
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
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {canCancel && (
              <Button
                size="lg"
                variant="destructive"
                className="gap-2"
                disabled={cancelLoading || resumeLoading || portalLoading}
                onClick={() => setCancelDialogOpen(true)}
              >
                {cancelLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {t.billing.cancelSubscription}
              </Button>
            )}
            {canResume && (
              <Button
                size="lg"
                variant="default"
                className="gap-2"
                disabled={cancelLoading || resumeLoading || portalLoading}
                onClick={() => void handleResume()}
              >
                {resumeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {t.billing.resumeSubscription}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={handleManage}
              disabled={portalLoading || cancelLoading || resumeLoading}
              className="gap-2"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              {t.billing.manageSub}
            </Button>
          </div>
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

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.billing.cancelDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-left text-sm text-muted-foreground">
                <p>
                  {t.billing.cancelDialogP1}
                  {periodEnd ? (
                    <>
                      {" "}
                      (<span className="font-medium text-foreground">{periodEnd}</span>).
                    </>
                  ) : (
                    "."
                  )}
                </p>
                <p>{t.billing.cancelDialogP2}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelLoading}
            >
              {t.billing.keepSubscription}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelLoading}
              className="gap-2"
              onClick={() => void handleConfirmCancel()}
            >
              {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t.billing.confirmCancel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
