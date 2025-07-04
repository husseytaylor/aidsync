"use client";

import dynamic from "next/dynamic";

const AnalyticsDashboardClient = dynamic(() => import("@/components/dashboard/analytics-client").then(mod => mod.AnalyticsDashboardClient), { ssr: false });

export function AnalyticsDashboardDynamic() {
  return <AnalyticsDashboardClient />;
}
