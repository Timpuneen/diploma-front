"use client";

/**
 * Landing page footer with links, theme toggle, and copyright.
 */

import { useEffect, useState } from "react";
import { Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
  const { t } = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <footer className="border-t border-border/50 bg-muted/30 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            LangProof AI
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {t.footer.description}
        </p>

        <div className="flex items-center gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  {mounted && (
                    theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {mounted && (
                  theme === "dark" ? t.sidebar.lightTheme : t.sidebar.darkTheme
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}