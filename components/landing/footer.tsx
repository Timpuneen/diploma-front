"use client";

/**
 * Landing page footer with links and copyright.
 */

import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {t("appName")}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("footerTagline")}
        </p>

        <p className="text-xs text-muted-foreground">
          {new Date().getFullYear()} {t("footerRights")}
        </p>
      </div>
    </footer>
  );
}
