"use client";

/**
 * Dashboard layout with auth protection, sidebar, and mobile header.
 */

import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileHeader } from "@/components/dashboard/dashboard-mobile-header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardMobileHeader />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
