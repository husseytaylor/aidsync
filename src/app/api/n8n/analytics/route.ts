
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

export async function GET() {
  const N8N_API_KEY = process.env.N8N_API_KEY;

  if (!N8N_API_KEY) {
    return NextResponse.json({ error: 'N8N_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const response = await fetch("https://bridgeboost.app.n8n.cloud/api/v1/executions?limit=50", {
      headers: {
        'Authorization': `Bearer ${N8N_API_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error("Failed to fetch from n8n API. Status:", response.status);
      const errorText = await response.text();
      return NextResponse.json({ error: 'Failed to fetch data from n8n.', details: errorText }, { status: response.status });
    }

    const { data: executions } = await response.json() as { data: N8nExecution[] };
    
    if (!Array.isArray(executions)) {
      return NextResponse.json({ error: 'Invalid data format from n8n API.' }, { status: 500 });
    }

    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'success').length;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;
    
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
