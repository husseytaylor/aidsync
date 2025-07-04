
import { AnalyticsDashboardDynamic } from "@/components/dashboard/analytics-dashboard-dynamic";

export default function AnalyticsPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <AnalyticsDashboardDynamic />;
}
