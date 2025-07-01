
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, MessageSquare, Timer, Calendar, Bot, User, LineChart as LineChartIcon, FileText, BarChart3, Users, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  voice_analytics: {
    summary: {
      total_calls: number;
      average_duration_seconds: number;
    };
    recent_calls: {
      started_at: string;
      duration: number;
      transcript: string;
    }[];
  };
  chat_analytics: {
    summary: {
      total_sessions: number;
      average_duration_seconds: number;
      average_message_count: number;
    };
    recent_sessions: {
      started_at: string;
      duration: number;
      dialogue: { sender: string; text: string }[];
    }[];
  };
  voiceChartData: { date: string; calls: number }[];
  chatChartData: { date: string; sessions: number }[];
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
    <div className="space-y-4">
      {dialogue && dialogue.length > 0 ? dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn('relative max-w-sm rounded-xl px-4 py-2 text-sm shadow', message.sender === 'user' ? 'bg-aidsync-gradient-green text-primary-foreground' : 'bg-foreground/10 text-foreground/90')}>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          {message.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      )) : <p className="text-muted-foreground text-center">No dialogue found.</p>}
    </div>
);

export function AnalyticsDashboardClient({ analyticsData }: { analyticsData: AnalyticsData }) {
  const { voice_analytics, chat_analytics, voiceChartData, chatChartData } = analyticsData;

  const voiceChartConfig = { calls: { label: "Calls", color: "hsl(var(--primary))" } } satisfies ChartConfig;
  const chatChartConfig = { sessions: { label: "Sessions", color: "hsl(var(--accent))" } } satisfies ChartConfig;

  return (
    <div className="container mx-auto">
      <AnimatedSection>
          <h1 className="font-headline text-4xl font-extrabold text-foreground tracking-tight" style={{ textShadow: "0 0 10px hsl(var(--accent) / 0.5)" }}>AidSync Agent Insights</h1>
          <p className="text-muted-foreground mt-2 text-lg">Live metrics from your customer-facing AI chat and voice agents.</p>
      </AnimatedSection>
      
      <div className="grid gap-8 lg:grid-cols-2 items-start mt-8">
        {/* Voice Analytics Column */}
        <AnimatedSection tag="div" className="space-y-8 lg:col-span-1" delay={100}>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-headline text-accent">
                <Phone />
                Voice Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4"/>Total Calls</dt>
                  <dd className="text-4xl font-bold text-foreground mt-1">{voice_analytics.summary.total_calls}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2"><Clock className="w-4 h-4"/>Avg. Duration</dt>
                  <dd className="text-4xl font-bold text-foreground mt-1">{formatDuration(voice_analytics.summary.average_duration_seconds)}</dd>
                </div>
              </div>
              <div className="h-[250px] p-2">
                  <ChartContainer config={voiceChartConfig} className="h-full w-full">
                      <ResponsiveContainer>
                          <LineChart data={voiceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
                              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
                              <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                              <Line dataKey="calls" type="monotone" stroke="var(--color-calls)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-calls)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-calls)' }} />
                          </LineChart>
                      </ResponsiveContainer>
                  </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Recent Calls</CardTitle>
              <CardDescription>Review transcripts from the latest calls.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {voice_analytics.recent_calls.length > 0 ? voice_analytics.recent_calls.map((call, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <div className="flex justify-between items-center rounded-lg p-3 bg-black/20 hover:bg-black/30 border border-white/10 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3 text-sm">
                           <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(call.started_at)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 text-muted-foreground text-sm"><Timer className="w-4 h-4" /> {formatDuration(call.duration)}</div>
                           <Button variant="ghost" size="sm" className="h-8">View</Button>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><FileText /> Call Transcript</DialogTitle>
                        <CardDescription>{formatTimestamp(call.started_at)} &bull; {formatDuration(call.duration)}</CardDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[50vh] mt-4">
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body p-4 bg-black/20 rounded-md">{call.transcript || "No transcript available."}</pre>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )) : <div className="rounded-lg bg-black/20 p-6 text-center text-sm text-muted-foreground">No recent calls found.</div>}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Chat Analytics Column */}
        <AnimatedSection tag="div" className="space-y-8 lg:col-span-1" delay={200}>
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-headline text-accent">
                <MessageSquare />
                Chat Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2"><Users className="w-4 h-4"/>Total</dt>
                  <dd className="text-3xl font-bold text-foreground mt-1">{chat_analytics.summary.total_sessions}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2"><Clock className="w-4 h-4"/>Avg. Time</dt>
                  <dd className="text-3xl font-bold text-foreground mt-1">{formatDuration(chat_analytics.summary.average_duration_seconds)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4"/>Avg. Msgs</dt>
                  <dd className="text-3xl font-bold text-foreground mt-1">{Math.round(chat_analytics.summary.average_message_count)}</dd>
                </div>
              </div>
               <div className="h-[250px] p-2">
                  <ChartContainer config={chatChartConfig} className="h-full w-full">
                      <ResponsiveContainer>
                          <LineChart data={chatChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.5)" />
                              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} />
                              <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                              <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-sessions)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-sessions)' }} />
                          </LineChart>
                      </ResponsiveContainer>
                  </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-headline">Recent Chat Sessions</CardTitle>
              <CardDescription>Review dialogues from the latest sessions.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                {chat_analytics.recent_sessions.length > 0 ? chat_analytics.recent_sessions.map((session, index) => (
                  <Dialog key={index}>
                      <DialogTrigger asChild>
                          <div className="flex justify-between items-center rounded-lg p-3 bg-black/20 hover:bg-black/30 border border-white/10 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(session.started_at)}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 text-muted-foreground text-sm"><Timer className="w-4 h-4" /> {formatDuration(session.duration)}</div>
                                  <Button variant="ghost" size="sm" className="h-8">View</Button>
                              </div>
                          </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                          <DialogHeader>
                              <DialogTitle className="flex items-center gap-2"><MessageSquare /> Chat Dialogue</DialogTitle>
                              <CardDescription>{formatTimestamp(session.started_at)} &bull; {formatDuration(session.duration)}</CardDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] mt-4 pr-4">
                              <ChatDialogue dialogue={session.dialogue} />
                          </ScrollArea>
                      </DialogContent>
                  </Dialog>
                )) : <div className="rounded-lg bg-black/20 p-6 text-center text-sm text-muted-foreground">No recent sessions found.</div>}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
