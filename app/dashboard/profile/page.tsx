"use client";

import React from "react";

/**
 * User profile page displaying user information and limits.
 * Connected to the FastAPI backend via auth-context and apiClient.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import type { UserLimits, TelegramStatusResponse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import {
  UserCircle,
  Mail,
  Shield,
  BarChart3,
  Loader2,
  MessageCircle,
  ExternalLink,
  Unlink,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, locale } = useLocale();

  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatusResponse | null>(null);
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [isDisconnectingTelegram, setIsDisconnectingTelegram] = useState(false);

  useEffect(() => {
    apiClient.getUserLimits().then(setLimits).catch(() => {});
    apiClient.getTelegramStatus().then(setTelegramStatus).catch(() => {});
  }, []);

  async function handleConnectTelegram() {
    setIsConnectingTelegram(true);
    try {
      const { bot_url } = await apiClient.generateTelegramUrl();
      window.open(bot_url, "_blank");
    } catch {
      toast.error("Failed to generate Telegram link");
    } finally {
      setIsConnectingTelegram(false);
    }
  }

  async function handleDisconnectTelegram() {
    setIsDisconnectingTelegram(true);
    try {
      await apiClient.disconnectTelegram();
      setTelegramStatus({ is_connected: false, telegram_chat_id: null });
      toast.success("Telegram disconnected");
    } catch {
      toast.error("Failed to disconnect Telegram");
    } finally {
      setIsDisconnectingTelegram(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t.profilePage.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.profilePage.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* User avatar / info header */}
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {user.username}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{t.profilePage.personalInfo}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InfoRow icon={UserCircle} label={t.profilePage.name} value={user.username} />
            <Separator />
            <InfoRow icon={Mail} label={t.profilePage.email} value={user.email} />
          </CardContent>
        </Card>

        {/* Usage Limits */}
        {limits && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                {locale === "kk" ? "Пайдалану лимиттері" : "Лимиты использования"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === "kk" ? "Күнделікті" : "Дневные запросы"}
                  </span>
                  <span className="font-medium text-foreground">
                    {limits.daily_used} / {limits.daily_limit}
                  </span>
                </div>
                <Progress
                  value={(limits.daily_used / limits.daily_limit) * 100}
                  className="h-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {locale === "kk" ? "Қалды" : "Осталось"}: {limits.daily_remaining}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === "kk" ? "Айлық" : "Месячные запросы"}
                  </span>
                  <span className="font-medium text-foreground">
                    {limits.monthly_used} / {limits.monthly_limit}
                  </span>
                </div>
                <Progress
                  value={(limits.monthly_used / limits.monthly_limit) * 100}
                  className="h-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {locale === "kk" ? "Қалды" : "Осталось"}: {limits.monthly_remaining}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {locale === "kk" ? "Барлық сұраулар" : "Всего запросов"}
                </span>
                <span className="font-semibold text-foreground">{limits.total_requests}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Telegram Integration */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4" />
              Telegram
            </CardTitle>
          </CardHeader>
          <CardContent>
            {telegramStatus?.is_connected ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {locale === "kk" ? "Қосылған" : "Подключен"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chat ID: {telegramStatus.telegram_chat_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnectTelegram}
                  disabled={isDisconnectingTelegram}
                  className="gap-2"
                >
                  {isDisconnectingTelegram ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4" />
                  )}
                  {locale === "kk" ? "Ажырату" : "Отключить"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {locale === "kk" ? "Қосылмаған" : "Не подключен"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === "kk"
                      ? "Telegram бот арқылы хабарландырулар алыңыз"
                      : "Получайте уведомления через Telegram-бота"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnectTelegram}
                  disabled={isConnectingTelegram}
                  className="gap-2"
                >
                  {isConnectingTelegram ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  {locale === "kk" ? "Қосу" : "Подключить"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{t.profilePage.security}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.profilePage.password}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.profilePage.lastChanged}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t.profilePage.change}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
