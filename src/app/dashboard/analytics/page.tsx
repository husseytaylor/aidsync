import { AnalyticsDashboardClient } from "@/components/dashboard/analytics-client";

async function getAnalyticsData() {
  const defaultState = {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0 }, recent_calls: [] },
    chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
    voiceChartData: [],
    chatChartData: [],
  };

  try {
    const response = await fetch("https://bridgeboost.app.n8n.cloud/webhook/38ed3752-371e-49dc-87e6-2a15b0be206f", { cache: 'no-store' });

    if (!response.ok) {
      console.error("Failed to fetch analytics from external webhook. Status:", response.status);
      return defaultState;
    }

    const externalData = await response.json();

    const voice_analytics = externalData.voice_analytics || defaultState.voice_analytics;
    const chat_analytics = externalData.chat_analytics || defaultState.chat_analytics;
    
    const parsedChatSessions = (chat_analytics.recent_sessions || []).map((session: any) => {
      try {
        const dialogueData = session.dialogue && typeof session.dialogue === 'string' 
          ? JSON.parse(session.dialogue) 
          : (session.dialogue || []);
        return {
          ...session,
          dialogue: Array.isArray(dialogueData) ? dialogueData : [],
        }
      } catch (e) {
        console.error("Failed to parse chat dialogue:", e);
        return { ...session, dialogue: [] }
      }
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
    console.error("Error fetching or processing analytics data:", error);
    return defaultState;
  }
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  return <AnalyticsDashboardClient analyticsData={analyticsData} />;
}
