/**
 * Results page — redirects to the analyze page when accessed directly.
 * In production, this would load a specific analysis by ID from query params.
 */

import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function ResultsPage() {
  redirect(ROUTES.ANALYZE);
}
