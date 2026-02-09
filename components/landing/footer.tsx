/**
 * Landing page footer with links and copyright.
 */

import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            AI Text Detector
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Diploma project — Automated AI text detection system
        </p>

        <p className="text-xs text-muted-foreground">
          {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
