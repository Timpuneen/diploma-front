import { Suspense } from "react";
import { ResetPasswordClient } from "./reset-password-client";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Новый пароль",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
