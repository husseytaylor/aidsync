
import { NextResponse } from 'next/server';

async function getAnalyticsData() {
  const defaultState = {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0, total_duration_seconds: 0, total_cost: 0, average_cost: 0 }, recent_calls: [] },
    chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
    voiceChartData: [],
    chatChartData: [],
  };

  const VOICE_ANALYTICS_URL = "https://bridgeboost.app.n8n.cloud/webhook/38ed3752-371e-49dc-87e6-2a15b0be206f";
  const CHAT_ANALYTICS_URL = "https://bridgeboost.app.n8n.cloud/webhook/93ef703e-6ddb-4e23-9a49-d23637244075";

  try {
    const [voiceRes, chatRes] = await Promise.all([
      fetch(VOICE_ANALYTICS_URL, { cache: "no-store" }),
      fetch(CHAT_ANALYTICS_URL, { cache: "no-store" }),
    ]);
    
    let voiceRaw = null;
    if (voiceRes.ok) {
        try {
            const text = await voiceRes.text();
            if (text) voiceRaw = JSON.parse(text);
        } catch (e) {
            console.error("[Analytics API] Failed to parse JSON from voice webhook.");
        }
    } else {
        console.error(`[Analytics API] Failed to fetch voice analytics. Status: ${voiceRes.status} ${voiceRes.statusText}`);
    }

    let chatRaw = null;
    if (chatRes.ok) {
        try {
            const text = await chatRes.text();
            if (text) chatRaw = JSON.parse(text);
        } catch (e) {
            console.error("[Analytics API] Failed to parse JSON from chat webhook.");
        }
    } else {
        console.error(`[Analytics API] Failed to fetch chat analytics. Status: ${chatRes.status} ${chatRes.statusText}`);
    }
    
    let voice_analytics = { ...defaultState.voice_analytics, summary: { ...defaultState.voice_analytics.summary }, recent_calls: [] };
    let chat_analytics = { ...defaultState.chat_analytics, summary: { ...defaultState.chat_analytics.summary }, recent_sessions: [] };
    
    const voiceDataItems = voiceRaw ? (Array.isArray(voiceRaw) ? voiceRaw : [voiceRaw]) : [];
    voiceDataItems.forEach(item => {
        let itemData = item.json || item;
        if (typeof itemData === 'string') {
            try { itemData = JSON.parse(itemData); } catch (e) { 
                console.error("[Analytics API] Failed to parse nested JSON string from voice item:", itemData);
                return;
            }
        }
        if (itemData.voice_analytics) {
            Object.assign(voice_analytics.summary, itemData.voice_analytics.summary);
            voice_analytics.recent_calls.push(...(itemData.voice_analytics.recent_calls || []));
        }
    });

    const chatDataItems = chatRaw ? (Array.isArray(chatRaw) ? chatRaw : [chatRaw]) : [];
    chatDataItems.forEach(item => {
        let itemData = item.json || item;
        if (typeof itemData === 'string') {
            try { itemData = JSON.parse(itemData); } catch (e) { 
                console.error("[Analytics API] Failed to parse nested JSON string from chat item:", itemData);
                return;
            }
        }
        if (itemData.chat_analytics) {
            Object.assign(chat_analytics.summary, itemData.chat_analytics.summary);
            chat_analytics.recent_sessions.push(...(itemData.chat_analytics.recent_sessions || []));
        }
    });

    const uniqueCalls = Array.from(new Map(voice_analytics.recent_calls.map(call => [call.id || call.started_at, call])).values());
    voice_analytics.recent_calls = uniqueCalls.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()).slice(0, 5);
    
    const uniqueSessions = Array.from(new Map(chat_analytics.recent_sessions.map(session => [session.id || session.started_at, session])).values());
    chat_analytics.recent_sessions = uniqueSessions.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()).slice(0, 5);
      
    const parseDialogue = (dialogue: any): { sender: string; text: string }[] => {
      if (!dialogue || typeof dialogue !== 'string') return [];
      
      return dialogue.split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
              const colonIndex = line.indexOf(':');
              if (colonIndex === -1) {
                  return { sender: 'unknown', text: line.trim() };
              }
              const sender = line.substring(0, colonIndex).trim();
              const text = line.substring(colonIndex + 1).trim();
              return {
                  sender: sender.toLowerCase().includes('user') ? 'user' : 'assistant',
                  text,
              };
          });
    };

    const parsedChatSessions = chat_analytics.recent_sessions.map((session: any) => ({
      ...session,
      dialogue: parseDialogue(session.dialogue),
    }));

    if (!voice_analytics.summary.total_calls || voice_analytics.summary.total_calls === 0) {
        voice_analytics.summary.total_calls = uniqueCalls.length;
    }
    if (voice_analytics.summary && !voice_analytics.summary.total_duration_seconds && voice_analytics.recent_calls.length > 0) {
        voice_analytics.summary.total_duration_seconds = voice_analytics.recent_calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    }
    
    const totalCost = voice_analytics.recent_calls.reduce((sum, call) => sum + (call.cost || 0), 0);
    voice_analytics.summary.total_cost = totalCost;
    voice_analytics.summary.average_cost = voice_analytics.summary.total_calls > 0 ? totalCost / voice_analytics.summary.total_calls : 0;
      
    const processDataForChart = (data: { started_at: string }[], valueKey: string) => {
        if (!data) return [];
        const countsByDay = data.reduce((acc, item) => {
          const date = new Date(item.started_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(countsByDay)
          .map(([date, count]) => ({
            date,
            [valueKey]: count,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(-30)
          .map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          }));
    };

    const voiceChartData = processDataForChart(voice_analytics.recent_calls, 'calls');
    const chatChartData = processDataForChart(chat_analytics.recent_sessions, 'sessions');

    return {
      voice_analytics: {
        summary: voice_analytics.summary,
        recent_calls: voice_analytics.recent_calls,
      },
      chat_analytics: {
        summary: chat_analytics.summary,
        recent_sessions: parsedChatSessions,
      },
      voiceChartData,
      chatChartData,
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
