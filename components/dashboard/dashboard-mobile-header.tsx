"use client";

/**
 * Mobile header for dashboard with slide-out navigation.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Shield,
  Menu,
  FileSearch,
  History,
  UserCircle,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: ROUTES.ANALYZE, label: "Analyze Text", icon: FileSearch },
  { href: ROUTES.HISTORY, label: "History", icon: History },
  { href: ROUTES.PROFILE, label: "Profile", icon: UserCircle },
] as const;

export function DashboardMobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push(ROUTES.HOME);
  }

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card px-4 py-3 lg:hidden">
      <Link href={ROUTES.ANALYZE} className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">AI Detector</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-card p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center gap-2 border-b border-border/50 px-6 py-5">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              AI Detector
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
                    onClick={() => setOpen(false)}
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
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
