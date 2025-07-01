
import { NextResponse } from 'next/server';

// Cache the response for 60 seconds
export const revalidate = 60;

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = process.env.N8N_BASE_URL;

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
  if (!N8N_API_KEY || !N8N_BASE_URL) {
    const errorMsg = '[n8n Config Error] N8N_API_KEY or N8N_BASE_URL is not configured.';
    console.error(errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
  
  if (process.env.NODE_ENV === 'development') {
      console.log('[n8n Analytics] Fetching data from:', N8N_BASE_URL);
      console.log('[n8n Analytics] Using API Key Prefix:', N8N_API_KEY.slice(0, 8) + '...');
  }

  const headers = {
    Authorization: `Bearer ${N8N_API_KEY}`,
    Accept: 'application/json',
  };

  try {
    const [executionsRes, insightsRes] = await Promise.all([
      fetch(`${N8N_BASE_URL}/executions?limit=50`, { headers, next: { revalidate: 60 } }),
      fetch(`${N8N_BASE_URL}/insights/total`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!executionsRes.ok) {
        const errorText = await executionsRes.text();
        let friendlyError = 'Failed to fetch execution data from n8n.';
        
        if (executionsRes.status === 401 || executionsRes.status === 403) {
            friendlyError = 'Authentication with n8n failed. Please check if your N8N_API_KEY is correct and has the required permissions.';
        } else if (executionsRes.status >= 500) {
            friendlyError = 'The n8n server returned an error. Please check the n8n instance logs.';
        }
        
        console.error("n8n executions API error. Status:", executionsRes.status, "Details:", errorText);
        return NextResponse.json({ error: friendlyError }, { status: executionsRes.status });
    }

    if (!insightsRes.ok) {
        const errorText = await insightsRes.text();
        console.error("n8n insights API error. Status:", insightsRes.status, "Details:", errorText);
        return NextResponse.json({ error: 'Failed to fetch insights data from n8n.' }, { status: insightsRes.status });
    }

    const executionsPayload = await executionsRes.json();
    const executions: N8nExecution[] = executionsPayload?.data || [];
    const insights: N8nInsights = await insightsRes.json();

    const completed = executions.filter(e => e.startedAt && e.finishedAt);
    const totalDuration = completed.reduce((sum, e) => {
      return sum + (new Date(e.finishedAt!).getTime() - new Date(e.startedAt).getTime()) / 1000;
    }, 0);

    const avgDuration = completed.length > 0 ? totalDuration / completed.length : 0;
    
    let successRate = 0;
    if (insights?.total > 0) {
        successRate = (insights.success / insights.total) * 100;
    } else if (executions.length > 0) {
        const successfulExecutions = executions.filter(e => e.status === 'success').length;
        successRate = (successfulExecutions / executions.length) * 100;
    }

    const executionTimeline = executions.map(e => ({
      startedAt: e.startedAt,
      status: e.status,
      duration: e.finishedAt ? (new Date(e.finishedAt).getTime() - new Date(e.startedAt).getTime()) / 1000 : 0,
    })).sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

    return NextResponse.json({
      totalExecutions: insights?.total ?? executions.length,
      avgDuration: parseFloat(avgDuration.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      executionTimeline,
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("n8n analytics fetch error:", errorMessage);
    return NextResponse.json({ error: 'Failed to fetch n8n analytics data.' }, { status: 500 });
  }
}
