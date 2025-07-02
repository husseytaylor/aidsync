
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Bot, User, RefreshCw, Download, Info, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import React from "react";

interface AnalyticsData {
  voice_analytics: {
    summary: {
      total_calls: number;
      average_duration_seconds: number;
      total_duration_seconds: number;
    };
    recent_calls: {
      started_at: string;
      duration: number;
      transcript: string;
      status: string;
      from_number: string;
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const ChatDialogue = React.memo(({ dialogue }: { dialogue: { sender: string; text: string }[] }) => (
    <div className="space-y-4">
      {dialogue && dialogue.length > 0 ? dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn('relative max-w-sm rounded-xl px-4 py-2 text-sm shadow', message.sender === 'user' ? 'bg-muted text-foreground' : 'bg-accent/20 text-accent-foreground')}>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          {message.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 text-foreground flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      )) : <p className="text-muted-foreground text-center">No dialogue found.</p>}
    </div>
));
ChatDialogue.displayName = 'ChatDialogue';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  y: -6,
  boxShadow: '0 12px 30px rgba(72,209,204,0.2)'
};

export function AnalyticsDashboardClient({ analyticsData }: { analyticsData: AnalyticsData }) {
  const router = useRouter();
  const { voice_analytics, chat_analytics, voiceChartData, chatChartData } = analyticsData;

  const voiceChartConfig = { calls: { label: "Calls", color: "hsl(var(--primary))" } } satisfies ChartConfig;
  const chatChartConfig = { sessions: { label: "Sessions", color: "hsl(var(--accent))" } } satisfies ChartConfig;

  const handleRefresh = () => {
    router.refresh();
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  const isDataEmpty =
    voice_analytics.summary.total_calls === 0 &&
    chat_analytics.summary.total_sessions === 0 &&
    voice_analytics.recent_calls.length === 0 &&
    chat_analytics.recent_sessions.length === 0;

  if (isDataEmpty) {
    return (
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 space-y-16 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <Card className="p-8">
            <div className="flex justify-center mb-4">
              <Info className="w-12 h-12 text-accent animate-pulse" />
            </div>
            <h2 className="font-headline text-3xl font-semibold text-white tracking-tight" style={{ textShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
              Awaiting Your First Interaction
            </h2>
            <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
              Your analytics dashboard is live. As soon as your AI agents handle their first calls or chats, this page will populate with insights.
            </p>
            <div className="mt-6">
                <Button onClick={handleRefresh} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check for New Data
                </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 space-y-16">
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
        >
          <h1 className="font-headline text-4xl md:text-5xl font-semibold text-white tracking-tight" style={{ textShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
            AidSync Agent Insights
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
            Live metrics from your customer-facing AI chat and voice agents.
          </p>
          <div className="mt-6 flex justify-center gap-4">
              <Button onClick={handleRefresh} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
              </Button>
              <Button onClick={handleExport} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
              </Button>
          </div>
        </motion.div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <MotionCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={cardHover}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-white">
                <Phone className="text-primary"/>
                Voice Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-8">
                <div>
                    <dt className="text-sm text-gray-300">Total Calls</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-primary mt-1">{voice_analytics.summary.total_calls}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-300">Total Duration</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-primary mt-1">{formatDuration(voice_analytics.summary.total_duration_seconds)}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-300">Avg. Duration</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-primary mt-1">{formatDuration(voice_analytics.summary.average_duration_seconds)}</dd>
                </div>
            </CardContent>
          </MotionCard>
          
          <MotionCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={cardHover}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-white">
                <MessageSquare className="text-accent"/>
                Chat Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                <div>
                    <dt className="text-sm text-gray-300">Total</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-accent mt-1">{chat_analytics.summary.total_sessions}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-300">Avg. Time</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-accent mt-1">{formatDuration(chat_analytics.summary.average_duration_seconds)}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-300">Avg. Msgs</dt>
                    <dd className="text-4xl md:text-5xl font-bold text-accent mt-1">{Math.round(chat_analytics.summary.average_message_count)}</dd>
                </div>
            </CardContent>
          </MotionCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={cardHover}
            >
              <CardHeader>
                <CardTitle>Call Volume (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ChartContainer config={voiceChartConfig} className="h-full w-full">
                    <ResponsiveContainer>
                        <LineChart data={voiceChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.3)" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} className="text-xs text-slate-300" />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} className="text-xs text-slate-300" />
                            <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                            <Line dataKey="calls" type="monotone" stroke="var(--color-calls)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-calls)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-calls)' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </MotionCard>
            
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={cardHover}
            >
              <CardHeader>
                <CardTitle>Chat Volume (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ChartContainer config={chatChartConfig} className="h-full w-full">
                    <ResponsiveContainer>
                        <LineChart data={chatChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.3)" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} className="text-xs text-slate-300" />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} className="text-xs text-slate-300" />
                            <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                            <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-sessions)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-sessions)' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </MotionCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={cardHover}
            >
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                    <CardDescription>Review transcripts from the latest calls.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2">
                        {voice_analytics.recent_calls.length > 0 ? voice_analytics.recent_calls.map((call, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <div className="flex justify-between items-center rounded-lg p-3 hover:bg-white/5 border-b border-[#1F2A30] cursor-pointer transition-colors">
                                        <div>
                                            <div className="text-sm text-gray-300">{formatTimestamp(call.started_at)}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{call.from_number} - {call.status}</div>
                                        </div>
                                        <button className="text-[#48D1CC] hover:text-primary text-sm font-medium">View</button>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-black/70 backdrop-blur-lg border-accent/20 rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-white"><FileText /> Call Transcript</DialogTitle>
                                        <CardDescription>{formatTimestamp(call.started_at)} &bull; {formatDuration(call.duration)}</CardDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-[50vh] mt-4 pr-4">
                                        <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono p-4 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-inner leading-relaxed">{call.transcript || "No transcript available."}</pre>
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        )) : <div className="p-6 text-center text-sm text-gray-300">No recent calls found.</div>}
                    </div>
                </CardContent>
            </MotionCard>
            
            <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={cardHover}
            >
                <CardHeader>
                    <CardTitle>Recent Chat Sessions</CardTitle>
                    <CardDescription>Review dialogues from the latest sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2">
                        {chat_analytics.recent_sessions.length > 0 ? chat_analytics.recent_sessions.map((session, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <div className="flex justify-between items-center rounded-lg p-3 hover:bg-white/5 border-b border-[#1F2A30] cursor-pointer transition-colors">
                                        <div className="text-sm text-gray-300">{formatTimestamp(session.started_at)}</div>
                                        <button className="text-[#48D1CC] hover:text-primary text-sm font-medium">View</button>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl bg-black/70 backdrop-blur-lg border-accent/20 rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-white"><MessageSquare /> Chat Dialogue</DialogTitle>
                                        <CardDescription>{formatTimestamp(session.started_at)} &bull; {formatDuration(session.duration)}</CardDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-[60vh] mt-4 pr-4">
                                        <ChatDialogue dialogue={session.dialogue} />
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        )) : <div className="p-6 text-center text-sm text-gray-300">No recent sessions found.</div>}
                    </div>
                </CardContent>
            </MotionCard>
        </div>
    </section>
  );
}
