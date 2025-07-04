
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
function processWebhookData(rawData: unknown, type: 'voice_analytics' | 'chat_analytics') {
  const summary = { ...defaultState[type].summary };
  const recent_items: unknown[] = [];
  
  if (!rawData) return { summary, recent_items };

  const items = Array.isArray(rawData) ? rawData : [rawData];

  for (const item of items) {
    let itemData = item.json || item;
    if (typeof itemData === 'string') {
      try {
        itemData = JSON.parse(itemData);
      } catch {
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
const parseDialogue = (dialogue: unknown): { sender: string; text: string }[] => {
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
    } catch {
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


    // Define explicit types for calls and sessions
    interface Call {
      id?: string;
      started_at: string;
      duration?: number;
      transcript?: string;
      status?: string;
      from_number?: string;
      price?: number | string;
      json?: { transcript?: string };
      [key: string]: unknown;
    }
    interface Session {
      id?: string;
      started_at: string;
      duration?: number;
      duration_seconds?: number;
      dialogue?: string;
      json?: { dialogue?: string };
      [key: string]: unknown;
    }

    // Deduplicate, extract full transcript, and sort recent items
    const recent_calls = Array.from(
      new Map(
        rawRecentCalls
          .filter((call): call is Call => typeof call === 'object' && call !== null && 'started_at' in call)
          .map((call) => {
            const c = call as Call;
            const fullCallData = { ...c, transcript: c.json?.transcript || c.transcript };
            return [fullCallData.id || fullCallData.started_at, fullCallData];
          })
      ).values()
    )
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, 10);

    const recent_sessions_raw = Array.from(
      new Map(
        rawRecentSessions
          .filter((session): session is Session => typeof session === 'object' && session !== null && 'started_at' in session)
          .map((session) => {
            const s = session as Session;
            const fullSessionData = { ...s, dialogue: s.json?.dialogue || s.dialogue };
            return [fullSessionData.id || fullSessionData.started_at, fullSessionData];
          })
      ).values()
    )
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, 10);

    // Finalize summaries with calculated values (type guard for voice summary)
    if ('total_calls' in voiceSummary) {
      if (
        typeof voiceSummary.total_calls === 'undefined' ||
        voiceSummary.total_calls === 0
      ) {
        voiceSummary.total_calls = recent_calls.length;
      }
      if (
        typeof voiceSummary.total_duration_seconds === 'undefined' &&
        recent_calls.length > 0
      ) {
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
    }

    // Parse chat dialogues and ensure duration is correct
    const recent_sessions = recent_sessions_raw.map((session) => ({
      ...session,
      duration: (session as Session).duration_seconds || (session as Session).duration || 0,
      dialogue: parseDialogue((session as Session).dialogue),
    }));

    return {
      voice_analytics: { summary: voiceSummary, recent_calls },
      chat_analytics: { summary: chatSummary, recent_sessions },
      voiceChartData: processDataForChart(recent_calls, 'calls'),
      chatChartData: processDataForChart(recent_sessions, 'sessions'),
    };

  } catch (error) {
    if (error instanceof Error) {
      console.error("[Analytics API] Error fetching or processing analytics data:", error.message);
    } else {
      console.error("[Analytics API] Unknown error fetching or processing analytics data:", error);
    }
    return defaultState;
  }
}

export async function GET() {
    try {
        const data = await getAnalyticsData();
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
          console.error('[API /analytics] Error fetching analytics data:', error.message);
        } else {
          console.error('[API /analytics] Unknown error fetching analytics data:', error);
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
