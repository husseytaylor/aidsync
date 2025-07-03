
import { NextResponse } from 'next/server';

const VOICE_ANALYTICS_URL = "https://bridgeboost.app.n8n.cloud/webhook/38ed3752-371e-49dc-87e6-2a15b0be206f";
const CHAT_ANALYTICS_URL = "https://bridgeboost.app.n8n.cloud/webhook/93ef703e-6ddb-4e23-9a49-d23637244075";

const defaultState = {
  voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0, total_duration_seconds: 0, total_cost: 0, average_cost: 0 }, recent_calls: [] },
  chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
  voiceChartData: [],
  chatChartData: [],
};

// Helper function to process raw webhook data by normalizing it
function processWebhookData(rawData: any, type: 'voice_analytics' | 'chat_analytics') {
  const summary = { ...defaultState[type].summary };
  const recent_items: any[] = [];
  
  if (!rawData) return { summary, recent_items };

  const items = Array.isArray(rawData) ? rawData : [rawData];

  for (const item of items) {
    let itemData = item.json || item;
    if (typeof itemData === 'string') {
      try {
        itemData = JSON.parse(itemData);
      } catch (e) {
        console.error(`[Analytics API] Failed to parse nested JSON string from ${type} item:`, itemData);
        continue;
      }
    }

    if (itemData && itemData[type]) {
      Object.assign(summary, itemData[type].summary);
      const recent = itemData[type].recent_calls || itemData[type].recent_sessions || [];
      recent_items.push(...recent);
    }
  }

  return { summary, recent_items };
}

// Helper to parse chat dialogue from a raw string
const parseDialogue = (dialogue: any): { sender: string; text: string }[] => {
  if (!dialogue || typeof dialogue !== 'string') return [];
  return dialogue.split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return { sender: 'unknown', text: line.trim() };
      const sender = line.substring(0, colonIndex).trim();
      const text = line.substring(colonIndex + 1).trim();
      return { sender: sender.toLowerCase().includes('user') ? 'user' : 'assistant', text };
    });
};

// Helper to generate chart data from recent items
const processDataForChart = (data: { started_at: string }[], valueKey: string) => {
  if (!data || data.length === 0) return [];
  const countsByDay = data.reduce((acc, item) => {
    try {
      const date = new Date(item.started_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
    } catch (e) {
        console.error(`[Analytics API] Could not parse date for chart item:`, item);
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(countsByDay)
    .map(([date, count]) => ({ date, [valueKey]: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map(item => ({ ...item, date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
};


async function getAnalyticsData() {
  try {
    const [voiceRes, chatRes] = await Promise.all([
      fetch(VOICE_ANALYTICS_URL, { cache: "no-store" }),
      fetch(CHAT_ANALYTICS_URL, { cache: "no-store" }),
    ]);

    const voiceRaw = voiceRes.ok ? await voiceRes.json().catch(() => null) : null;
    const chatRaw = chatRes.ok ? await chatRes.json().catch(() => null) : null;
    
    // Process raw data using helper
    const { summary: voiceSummary, recent_items: rawRecentCalls } = processWebhookData(voiceRaw, 'voice_analytics');
    const { summary: chatSummary, recent_items: rawRecentSessions } = processWebhookData(chatRaw, 'chat_analytics');

    // Deduplicate and sort recent items
    const recent_calls = Array.from(new Map(rawRecentCalls.map(call => [call.id || call.started_at, call])).values())
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      // FIX: increased recent_calls slice to 10
      .slice(0, 10);
      
    const recent_sessions_raw = Array.from(new Map(rawRecentSessions.map(session => [session.id || session.started_at, session])).values())
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      // FIX: increased recent_sessions slice to 10
      .slice(0, 10);

    // Finalize summaries with calculated values
    if (!voiceSummary.total_calls || voiceSummary.total_calls === 0) {
      voiceSummary.total_calls = recent_calls.length;
    }
    if (voiceSummary && !voiceSummary.total_duration_seconds && recent_calls.length > 0) {
      voiceSummary.total_duration_seconds = recent_calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    }
    const totalCost = recent_calls.reduce((sum, call) => {
        const cost = typeof call.price === 'string' ? parseFloat(call.price) : (call.price || 0);
        return sum + cost;
    }, 0);

    voiceSummary.total_cost = parseFloat(totalCost.toFixed(2));
    voiceSummary.average_cost = voiceSummary.total_calls > 0
      ? parseFloat((totalCost / voiceSummary.total_calls).toFixed(2))
      : 0;

    // Parse chat dialogues and ensure duration is correct
    const recent_sessions = recent_sessions_raw.map((session: any) => ({
      ...session,
      duration: session.duration_seconds || session.duration || 0,
      dialogue: parseDialogue(session.dialogue),
    }));

    return {
      voice_analytics: { summary: voiceSummary, recent_calls },
      chat_analytics: { summary: chatSummary, recent_sessions },
      voiceChartData: processDataForChart(recent_calls, 'calls'),
      chatChartData: processDataForChart(recent_sessions, 'sessions'),
    };

  } catch (error) {
    console.error("[Analytics API] Error fetching or processing analytics data:", error);
    return defaultState;
  }
}

export async function GET(request: Request) {
    try {
        const data = await getAnalyticsData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API /analytics] Error fetching analytics data:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
