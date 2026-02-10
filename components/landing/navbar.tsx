"use client";

/**
 * Landing page navigation bar with responsive mobile menu and language switcher.
 */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X, Shield } from "lucide-react";

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_LINKS = [
    { href: "#features", label: t("navFeatures") },
    { href: "#how-it-works", label: t("navHowItWorks") },
    { href: "#languages", label: t("navLanguages") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            {t("appName")}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher compact />
          <Button variant="ghost" asChild>
            <Link href={ROUTES.LOGIN}>{t("navSignIn")}</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.REGISTER}>{t("navGetStarted")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMobileOpen && (
        <div className="border-t border-border/50 bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher />
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.LOGIN}>{t("navSignIn")}</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.REGISTER}>{t("navGetStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
