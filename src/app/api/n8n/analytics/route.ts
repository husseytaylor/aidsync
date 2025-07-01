
import { NextResponse } from 'next/server';

// Cache the response for 60 seconds
export const revalidate = 60;

interface N8nExecution {
  id: string;
  status: 'success' | 'failed' | 'running';
  startedAt: string;
  finishedAt?: string;
  workflowId: string;
  mode: string;
}

interface N8nInsights {
    total: number;
    success: number;
    failed: number;
    running: number;
}

export async function GET() {
  const N8N_API_KEY = process.env.N8N_API_KEY;

  if (!N8N_API_KEY) {
    return NextResponse.json({ error: 'N8N_API_KEY is not configured.' }, { status: 500 });
  }
  
  const headers = {
    'Authorization': `Bearer ${N8N_API_KEY}`,
    'Accept': 'application/json',
  };

  try {
    const [executionsResponse, insightsResponse] = await Promise.all([
        fetch("https://bridgeboost.app.n8n.cloud/api/v1/executions?limit=50", { headers, next: { revalidate: 60 } }),
        fetch("https://bridgeboost.app.n8n.cloud/api/v1/insights/total", { headers, next: { revalidate: 60 } })
    ]);

    if (!executionsResponse.ok) {
      console.error("Failed to fetch from n8n executions API. Status:", executionsResponse.status);
      const errorText = await executionsResponse.text();
      return NextResponse.json({ error: 'Failed to fetch execution data from n8n.', details: errorText }, { status: executionsResponse.status });
    }

    const { data: executions } = await response.json() as { data: N8nExecution[] };
    
    if (!Array.isArray(executions)) {
      return NextResponse.json({ error: 'Invalid data format from n8n API.' }, { status: 500 });
    }

    let totalExecutions: number;
    let successRate: number;

    if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json() as N8nInsights;
        if(insightsData && insightsData.total !== undefined && insightsData.success !== undefined) {
            totalExecutions = insightsData.total;
            successRate = insightsData.total > 0 ? (insightsData.success / insightsData.total) * 100 : 0;
        } else {
            totalExecutions = executions.length;
            const successfulExecutions = executions.filter(e => e.status === 'success').length;
            successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
        }
    } else {
        console.warn("Failed to fetch n8n insights, falling back to execution-based totals. Status:", insightsResponse.status);
        totalExecutions = executions.length;
        const successfulExecutions = executions.filter(e => e.status === 'success').length;
        successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
    }
    
    const completedExecutions = executions.filter(e => e.finishedAt && e.startedAt);
    const totalDuration = completedExecutions.reduce((sum, e) => {
        const duration = (new Date(e.finishedAt!).getTime() - new Date(e.startedAt).getTime()) / 1000;
        return sum + duration;
    }, 0);
    
    const avgDuration = completedExecutions.length > 0 ? totalDuration / completedExecutions.length : 0;

    const executionTimeline = executions.map(e => ({
        startedAt: e.startedAt,
        status: e.status,
        duration: e.finishedAt ? (new Date(e.finishedAt).getTime() - new Date(e.startedAt).getTime()) / 1000 : 0,
    })).sort((a,b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

    return NextResponse.json({
      totalExecutions,
      avgDuration: parseFloat(avgDuration.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      executionTimeline,
    });

  } catch (error) {
    console.error("Error in n8n analytics route:", error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
