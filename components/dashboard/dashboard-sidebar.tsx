"use client";

/**
 * Dashboard sidebar navigation with route links and user info.
 * Collapsible sidebar with toggle button in header.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  FileSearch,
  History,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function DashboardSidebar({ collapsed = false, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLocale();

  const NAV_ITEMS = [
    { href: ROUTES.ANALYZE, label: t.sidebar.analyzeText, icon: FileSearch },
    { href: ROUTES.HISTORY, label: t.sidebar.history, icon: History },
    { href: ROUTES.PROFILE, label: t.sidebar.profile, icon: UserCircle },
  ];

  async function handleLogout() {
    await logout();
    router.push(ROUTES.HOME);
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex h-screen flex-col border-r border-border/50 bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Toggle button - positioned on the edge */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border-border/50 bg-card shadow-sm hover:bg-secondary"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div className="flex items-center border-b border-border/50 px-3 py-5">
          <Link
            href={ROUTES.HOME}
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center w-full"
            )}
          >
            <Shield className="h-6 w-6 shrink-0 text-primary" />
            {!collapsed && (
              <span className="text-lg font-semibold text-foreground">
                LangProof AI
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </div>
        </nav>

        <div className="border-t border-border/50 px-3 py-4">
          {user && !collapsed && (
            <div className="mb-3 px-3">
              <p className="truncate text-sm font-medium text-foreground">
                {user.username}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          )}
          <div className={cn("flex items-center gap-2", collapsed && "flex-col")}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{t.sidebar.signOut}</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                className="flex-1 justify-start gap-3 text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {t.sidebar.signOut}
              </Button>
            )}
            {!collapsed && (
              <LanguageSwitcher
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              />
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
