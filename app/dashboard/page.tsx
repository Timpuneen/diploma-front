/**
 * Dashboard index page — redirects to the analyze page.
 */

import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function DashboardPage() {
  redirect(ROUTES.ANALYZE);
}
