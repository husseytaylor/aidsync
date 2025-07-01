
import { NextResponse } from 'next/server';

// Revalidate every 60 seconds
export const revalidate = 60;

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = process.env.N8N_BASE_URL;

interface N8nExecution {
  id: string;
  status: 'success' | 'failed' | 'running';
  startedAt: string;
  finishedAt?: string;
  workflow: {
      id: string;
      name: string;
  };
}

export async function GET() {
  if (!N8N_API_KEY || !N8N_BASE_URL) {
    const errorMsg = '[n8n Config Error] N8N_API_KEY or N8N_BASE_URL is not configured.';
    console.error(errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[n8n Analytics] Fetching executions from:', `${N8N_BASE_URL}/executions`);
    console.log('[n8n Analytics] Using API Key Prefix:', N8N_API_KEY.slice(0, 8) + '...');
  }

  const headers = {
    'X-N8N-API-KEY': N8N_API_KEY,
    Accept: 'application/json',
  };

  try {
    const executionsRes = await fetch(`${N8N_BASE_URL}/executions?limit=25`, { 
        headers, 
        next: { revalidate: 60 } 
    });
    
    if (!executionsRes.ok) {
        const errorText = await executionsRes.text();
        let friendlyError = 'Failed to fetch execution data from n8n.';
        
        if (executionsRes.status === 401 || executionsRes.status === 403) {
            friendlyError = 'Authentication with n8n failed. Please check if your N8N_API_KEY is correct and has the required permissions (execution:read).';
        } else if (executionsRes.status >= 500) {
            friendlyError = 'The n8n server returned an error. Please check the n8n instance logs.';
        }
        
        console.error("n8n executions API error. Status:", executionsRes.status, "Details:", errorText);
        return NextResponse.json({ error: friendlyError }, { status: executionsRes.status });
    }

    const executionsPayload = await executionsRes.json();
    const executions: N8nExecution[] = executionsPayload?.data || [];

    const totalExecutions = executions.length;
    const successCount = executions.filter(e => e.status === 'success').length;
    const failedCount = executions.filter(e => e.status === 'failed').length;
    const runningCount = totalExecutions - successCount - failedCount;
    const successRate = totalExecutions > 0 ? (successCount / totalExecutions) * 100 : 0;

    const completed = executions.filter(e => e.status !== 'running' && e.startedAt && e.finishedAt);
    const totalDuration = completed.reduce((sum, e) => {
      return sum + (new Date(e.finishedAt!).getTime() - new Date(e.startedAt).getTime()) / 1000;
    }, 0);
    const avgDuration = completed.length > 0 ? totalDuration / completed.length : 0;

    const recentExecutions = executions.map(e => ({
      id: e.id,
      workflowName: e.workflow.name,
      status: e.status,
      startedAt: e.startedAt,
      duration: e.finishedAt ? (new Date(e.finishedAt).getTime() - new Date(e.startedAt).getTime()) / 1000 : null,
    }));

    return NextResponse.json({
      totalExecutions,
      successCount,
      failedCount,
      runningCount,
      successRate: parseFloat(successRate.toFixed(2)),
      avgDuration: parseFloat(avgDuration.toFixed(2)),
      recentExecutions,
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("n8n analytics fetch error:", errorMessage);
    return NextResponse.json({ error: 'Failed to fetch n8n analytics data.' }, { status: 500 });
  }
}
