"use client";

/**
 * Dashboard sidebar navigation with route links and user info.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Shield,
  FileSearch,
  History,
  UserCircle,
  LogOut,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { href: ROUTES.ANALYZE, label: t("sidebarAnalyze"), icon: FileSearch },
    { href: ROUTES.HISTORY, label: t("sidebarHistory"), icon: History },
    { href: ROUTES.PROFILE, label: t("sidebarProfile"), icon: UserCircle },
  ];

  async function handleLogout() {
    await logout();
    router.push(ROUTES.HOME);
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/50 bg-card">
      <div className="flex items-center gap-2 border-b border-border/50 px-6 py-5">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-foreground">
          {t("appName")}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border/50 px-3 py-4">
        <div className="mb-3 px-3">
          <LanguageSwitcher compact />
        </div>
        {user && (
          <div className="mb-3 px-3">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t("sidebarSignOut")}
        </Button>
      </div>
    </aside>
  );
}
