"use client";

import React from "react"

/**
 * User profile page with editable name/email and account info.
 * Uses AuthContext for user data; ready for backend integration.
 */

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/i18n/locale-context";
import { toast } from "sonner";
import { Loader2, UserCircle, Mail, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const { t, locale } = useLocale();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t.profilePage.nameEmpty);
      return;
    }
    if (!email.trim()) {
      toast.error(t.profilePage.emailEmpty);
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with apiClient.updateProfile({ name, email }) when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateUser({ name, email });
      setIsEditing(false);
      toast.success(t.profilePage.updateSuccess);
    } catch {
      toast.error(t.profilePage.updateFailed);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setIsEditing(false);
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
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Editable profile form */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{t.profilePage.personalInfo}</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                {t.profilePage.edit}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="profile-name">{t.profilePage.fullName}</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="profile-email">{t.profilePage.email}</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.profilePage.saving}
                      </>
                    ) : (
                      t.profilePage.saveChanges
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    {t.profilePage.cancel}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <InfoRow icon={UserCircle} label={t.profilePage.name} value={user.name} />
                <Separator />
                <InfoRow icon={Mail} label={t.profilePage.email} value={user.email} />
                <Separator />
                <InfoRow
                  icon={Calendar}
                  label={t.profilePage.memberSince}
                  value={new Date(user.createdAt).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account section */}
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
