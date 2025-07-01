
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Workflow, Timer, CheckCircle, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalExecutions: number;
  avgDuration: number;
  successRate: number;
  executionTimeline: {
    startedAt: string;
    status: string;
    duration: number | null;
  }[];
}

const chartConfig = {
  duration: {
    label: "Duration (s)",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

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

export function N8nAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/n8n/analytics');
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to fetch n8n analytics');
        }
        const result: AnalyticsData = await response.json();
        const formattedResult = {
            ...result,
            executionTimeline: result.executionTimeline.map(e => ({
                ...e,
                startedAt: new Date(e.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            }))
        }
        setData(formattedResult);
        setError(null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        if(loading){
            setLoading(false);
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <N8nAnalyticsSkeleton />;
  }

  if (error) {
    return (
      <Card className="bg-card border-accent/20 backdrop-blur-sm lg:col-span-2">
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
  
  const successRateColor = data.successRate >= 80 ? "text-primary" : "text-destructive";

  return (
    <Card className="bg-card border-accent/20 backdrop-blur-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
          <Workflow />
          n8n Workflow Stats
        </CardTitle>
        <CardDescription>Live metrics from the n8n automation instance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Total Executions" value={data.totalExecutions} icon={CheckCircle} />
          <MetricCard title="Avg Duration" value={data.avgDuration} icon={Timer} unit="s" />
           <div className="rounded-lg bg-black/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Success Rate</h3>
            </div>
            <p className={cn("text-2xl font-semibold", successRateColor)}>
              {data.successRate}<span className="text-lg">%</span>
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-headline mb-4">Execution Duration (Last 50)</h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={data.executionTimeline} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
                <XAxis 
                  dataKey="startedAt" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8} 
                  width={30} 
                  domain={[0, 'dataMax + 10']}
                  allowDecimals={false}
                  label={{ value: 'Seconds', angle: -90, position: 'insideLeft', offset: 0, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                />
                <ChartTooltip 
                  cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} 
                  content={<ChartTooltipContent indicator="dot" />} 
                />
                <Line 
                  dataKey="duration" 
                  type="monotone" 
                  stroke="var(--color-duration)" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'hsl(var(--accent))' }} 
                />
                <Brush dataKey="startedAt" height={30} stroke="hsl(var(--accent))" fill="hsl(var(--background))" travellerWidth={15} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function N8nAnalyticsSkeleton() {
    return (
        <Card className="bg-card border-accent/20 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
                    <Workflow />
                    n8n Workflow Stats
                </CardTitle>
                 <CardDescription>Live metrics from the n8n automation instance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-black/20 p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                    <div className="rounded-lg bg-black/20 p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                    <div className="rounded-lg bg-black/20 p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-headline mb-4">Execution Duration (Last 50)</h3>
                    <Skeleton className="h-[300px] w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    )
}
