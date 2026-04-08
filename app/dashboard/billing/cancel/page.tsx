"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function BillingCancelPage() {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-center py-24 px-6">
      <Card className="w-full max-w-md border-border/50">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            {t.billing.cancelTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.billing.cancelSubtitle}
          </p>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href={ROUTES.BILLING}>{t.billing.retry}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.ANALYZE}>{t.billing.backToDashboard}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
