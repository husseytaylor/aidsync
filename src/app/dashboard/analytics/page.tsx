import { AnalyticsDashboardClient } from "@/components/dashboard/analytics-client";
import { ANALYTICS_WEBHOOK_URL } from "@/config";

async function getAnalyticsData() {
  const defaultState = {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0 }, recent_calls: [] },
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
    // A successful response with an empty body is valid (e.g., no data to report), so just return the default state.
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
    
    const externalData = Array.isArray(rawData) ? rawData[0] : rawData;
    
    if (!externalData) {
        console.error("[Analytics Page] Webhook data is empty or in an unexpected format.");
        return defaultState;
    }

    const voice_analytics = externalData.voice_analytics || defaultState.voice_analytics;
    const chat_analytics = externalData.chat_analytics || defaultState.chat_analytics;
    
    const parsedChatSessions = (chat_analytics.recent_sessions || []).map((session: any) => {
      if (!session.dialogue) {
        return { ...session, dialogue: [] };
      }

      if (Array.isArray(session.dialogue)) {
        return { ...session };
      }

      // Handle cases where dialogue is a stringified JSON array
      if (typeof session.dialogue === 'string') {
        try {
          const parsed = JSON.parse(session.dialogue);
          return { ...session, dialogue: Array.isArray(parsed) ? parsed : [] };
        } catch (e) {
          // Handle cases where dialogue is a simple string log
          const parsedFromText = session.dialogue.split('\n').filter(line => line.trim() !== '').map(line => {
            const parts = line.split(': ');
            const sender = parts.shift()?.trim() || 'unknown';
            const text = parts.join(': ').trim();
            return {
              sender: sender.toLowerCase().includes('user') ? 'user' : 'assistant',
              text: text,
            };
          });
          return { ...session, dialogue: parsedFromText };
        }
      }
      
      return { ...session, dialogue: [] };
    }).slice(0, 5);
      
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
        ...voice_analytics,
        recent_calls: (voice_analytics.recent_calls || []).slice(0, 5),
      },
      chat_analytics: {
        ...chat_analytics,
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
