
import { NextResponse } from 'next/server';

// Cache the response for 60 seconds
export const revalidate = 60;

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = 'https://bridgeboost.app.n8n.cloud/api/v1';

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
  if (!N8N_API_KEY || N8N_API_KEY.includes('BLANK_VALUE')) {
    return NextResponse.json({ error: 'N8N_API_KEY is not configured.' }, { status: 500 });
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
        console.error("Failed to fetch from n8n executions API. Status:", executionsRes.status, "Details:", errorText);
        return NextResponse.json({ error: 'Failed to fetch execution data from n8n.' }, { status: executionsRes.status });
    }

    const executionsPayload = await executionsRes.json();
    const executions: N8nExecution[] = executionsPayload?.data || [];

    const insights = insightsRes.ok ? await insightsRes.json() : null;

    const completed = executions.filter(e => e.startedAt && e.finishedAt);
    const totalDuration = completed.reduce((sum, e) => {
      return sum + (new Date(e.finishedAt!).getTime() - new Date(e.startedAt).getTime()) / 1000;
    }, 0);

    const avgDuration = completed.length ? totalDuration / completed.length : 0;
    
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

  } catch (err) {
    console.error("n8n analytics error:", err);
    return NextResponse.json({ error: 'Failed to fetch n8n analytics' }, { status: 500 });
  }
}
