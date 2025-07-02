
import { AnalyticsDashboardClient } from "@/components/dashboard/analytics-client";
import { ANALYTICS_WEBHOOK_URL } from "@/config";

async function getAnalyticsData() {
  const defaultState = {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0, total_duration_seconds: 0 }, recent_calls: [] },
    chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
    voiceChartData: [],
    chatChartData: [],
  };

  const webhookUrl = ANALYTICS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[Analytics Page] Agent analytics webhook URL is not configured.");
    return defaultState;
  }

  try {
    const response = await fetch(webhookUrl, { cache: 'no-store' });

    if (!response.ok) {
      console.error(`[Analytics Page] Failed to fetch analytics from webhook. Status: ${response.status} ${response.statusText}`);
      return defaultState;
    }
    
    const responseText = await response.text();
    if (!responseText) {
        return defaultState;
    }

    let rawData;
    try {
      rawData = JSON.parse(responseText);
    } catch (e) {
      console.error("[Analytics Page] Failed to parse JSON from webhook. Response was:", responseText);
      return defaultState;
    }
    
    const externalData = Array.isArray(rawData) ? rawData : [rawData];
    
    let voice_analytics = defaultState.voice_analytics;
    let chat_analytics = defaultState.chat_analytics;

    externalData.forEach(item => {
        const itemData = item.json || item; // Handle potential nesting
        if (itemData.voice_analytics) {
            voice_analytics = itemData.voice_analytics;
        }
        if (itemData.chat_analytics) {
            chat_analytics = itemData.chat_analytics;
        }
    });

    const parseDialogue = (dialogue: any): { sender: string; text: string }[] => {
        if (!dialogue) return [];
        if (Array.isArray(dialogue)) return dialogue; // Already parsed
        if (typeof dialogue !== 'string') return [];

        try {
            // Try parsing as JSON first for backward compatibility
            const parsed = JSON.parse(dialogue);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            // If not JSON, parse as multi-line string
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
        }
    };

    const parsedChatSessions = (chat_analytics.recent_sessions || []).map((session: any) => ({
      ...session,
      dialogue: parseDialogue(session.dialogue),
    })).slice(0, 5);
      
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
        summary: voice_analytics.summary || defaultState.voice_analytics.summary,
        recent_calls: (voice_analytics.recent_calls || []).slice(0, 5),
      },
      chat_analytics: {
        summary: chat_analytics.summary || defaultState.chat_analytics.summary,
        recent_sessions: parsedChatSessions,
      },
      voiceChartData,
      chatChartData,
    };

  } catch (error) {
    console.error("[Analytics Page] Error fetching or processing analytics data:", error);
    return defaultState;
  }
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  return <AnalyticsDashboardClient analyticsData={analyticsData} />;
}
