import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageSquare, Timer, Calendar, Bot, User, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AnimatedSection } from "@/components/animated-section";

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
    
    const parsedChatSessions = (chat_analytics.recent_sessions || []).map(session => {
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

const formatDuration = (totalSeconds: number) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const ChatDialogue = ({ dialogue }: { dialogue: { sender: string; text: string }[] }) => (
    <div className="space-y-4 rounded-lg p-4 bg-black/20">
      {dialogue && dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn('relative max-w-xs rounded-xl px-4 py-2 text-sm shadow', message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground' )}>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          {message.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      ))}
    </div>
);

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  const { voice_analytics, chat_analytics, voiceChartData, chatChartData } = analyticsData;

  const voiceChartConfig = { calls: { label: "Calls", color: "hsl(var(--accent))" } } satisfies ChartConfig;
  const chatChartConfig = { sessions: { label: "Sessions", color: "hsl(var(--accent))" } } satisfies ChartConfig;

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      {/* Voice Analytics Column */}
      <AnimatedSection tag="div" className="space-y-8" delay={100}>
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
              <Phone />
              Voice Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Total Calls</h3>
              <p className="text-2xl font-semibold text-white">{voice_analytics.summary.total_calls}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Average Duration</h3>
              <p className="text-2xl font-semibold text-white">{formatDuration(voice_analytics.summary.average_duration_seconds)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <LineChartIcon />
                    Call Volume (Last 30 Days)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={voiceChartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={voiceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
                            <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                            <Line dataKey="calls" type="monotone" stroke="var(--color-calls)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-calls)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'hsl(var(--accent))' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Recent Calls</CardTitle>
            <CardDescription>Review transcripts from the latest calls.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {voice_analytics.recent_calls.length > 0 ? voice_analytics.recent_calls.map((call, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 border-white/10 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between w-full items-center text-sm">
                       <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(call.started_at)}</div>
                       <div className="flex items-center gap-2 text-muted-foreground"><Timer className="w-4 h-4" /> {formatDuration(call.duration)}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4 whitespace-pre-wrap">{call.transcript}</AccordionContent>
                </AccordionItem>
              )) : <p className="text-muted-foreground text-sm">No recent calls found.</p>}
            </Accordion>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Chat Analytics Column */}
      <AnimatedSection tag="div" className="space-y-8" delay={200}>
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
              <MessageSquare />
              Chat Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Total Sessions</h3>
              <p className="text-2xl font-semibold text-white">{chat_analytics.summary.total_sessions}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Duration</h3>
              <p className="text-2xl font-semibold text-white">{formatDuration(chat_analytics.summary.average_duration_seconds)}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Messages</h3>
              <p className="text-2xl font-semibold text-white">{Math.round(chat_analytics.summary.average_message_count)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                    <LineChartIcon />
                    Chat Volume (Last 30 Days)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chatChartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={chatChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
                            <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                            <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-sessions)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'hsl(var(--accent))' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Recent Chat Sessions</CardTitle>
            <CardDescription>Review dialogues from the latest sessions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full space-y-2">
              {chat_analytics.recent_sessions.length > 0 ? chat_analytics.recent_sessions.map((session, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 border-white/10 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                     <div className="flex justify-between w-full items-center text-sm">
                       <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(session.started_at)}</div>
                       <div className="flex items-center gap-2 text-muted-foreground"><Timer className="w-4 h-4" /> {formatDuration(session.duration)}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ChatDialogue dialogue={session.dialogue} />
                  </AccordionContent>
                </AccordionItem>
              )) : <p className="text-muted-foreground text-sm">No recent sessions found.</p>}
            </Accordion>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
