
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Workflow, Timer, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Execution {
  id: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  startedAt: string;
  duration: number | null;
}

interface AnalyticsData {
  totalExecutions: number;
  successCount: number;
  failedCount: number;
  avgDuration: number;
  recentExecutions: Execution[];
}

const formatDuration = (seconds: number | null) => {
  if (seconds === null || seconds === undefined) return 'N/A';
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  return `${seconds.toFixed(2)}s`;
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const MetricCard = ({ title, value, icon: Icon, unit = "" }: { title: string, value: string | number, icon: React.ElementType, unit?: string }) => (
  <div className="rounded-lg bg-black/20 p-4">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <h3 className="text-sm text-muted-foreground uppercase tracking-wide">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-white">
      {value}<span className="text-lg text-muted-foreground">{unit}</span>
    </p>
  </div>
);

const StatusBadge = ({ status }: { status: 'success' | 'failed' | 'running' }) => {
  const statusConfig = {
    success: { variant: "default", icon: CheckCircle, label: "Success", className: "bg-primary/20 text-primary-foreground border-primary/40 hover:bg-primary/30" },
    failed: { variant: "destructive", icon: XCircle, label: "Failed", className: "bg-destructive/20 text-destructive-foreground border-destructive/40 hover:bg-destructive/30" },
    running: { variant: "secondary", icon: PlayCircle, label: "Running", className: "bg-secondary/20 text-secondary-foreground border-secondary/40 hover:bg-secondary/30" },
  } as const;

  const { variant, icon: Icon, label, className } = statusConfig[status];

  return (
    <Badge variant={variant} className={cn("capitalize flex items-center gap-1.5", className)}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  );
};


export function N8nAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      if (isCancelled) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/n8n/analytics');
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(errData.error || `Request failed with status ${response.status}`);
        }
        const result = await response.json();
        if (!isCancelled) setData(result);
      } catch (err: any) {
        console.error("n8n analytics fetch failed:", err.message);
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60 * 1000); // 1 minute

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <N8nAnalyticsSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline text-destructive">
            <Workflow />
            n8n Workflow Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">Could not load n8n analytics: {error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
          <Workflow />
          n8n Workflow Stats
        </CardTitle>
        <CardDescription>Live metrics from the n8n automation instance (last 25 executions).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total" value={data.totalExecutions} icon={Workflow} />
          <MetricCard title="Successful" value={data.successCount} icon={CheckCircle} />
          <MetricCard title="Failed" value={data.failedCount} icon={XCircle} />
          <MetricCard title="Avg Duration" value={data.avgDuration.toFixed(2)} icon={Timer} unit="s" />
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-headline">Recent Executions</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Workflow</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Started At</TableHead>
                            <TableHead className="text-right">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.recentExecutions.map((exec) => (
                            <TableRow key={exec.id}>
                                <TableCell className="font-medium">{exec.workflowName}</TableCell>
                                <TableCell><StatusBadge status={exec.status} /></TableCell>
                                <TableCell>{formatTimestamp(exec.startedAt)}</TableCell>
                                <TableCell className="text-right">{formatDuration(exec.duration)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {data.recentExecutions.length === 0 && (
                     <div className="h-24 w-full flex items-center justify-center rounded-lg bg-black/20 text-center text-sm text-muted-foreground">
                        No recent executions found.
                    </div>
                )}
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function N8nAnalyticsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
                    <Workflow />
                    n8n Workflow Stats
                </CardTitle>
                 <CardDescription>Live metrics from the n8n automation instance (last 25 executions).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="rounded-lg bg-black/20 p-4 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-8 w-1/2" />
                      </div>
                    ))}
                </div>
                <Card>
                    <CardHeader>
                         <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}
