import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Подтверждение email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
