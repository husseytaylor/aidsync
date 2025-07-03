
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Bot, User, RefreshCw, Download, Info, Clock, DollarSign, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { useEffect } from "react";
import { useAnalytics } from "@/context/analytics-context";
import { Skeleton } from "@/components/ui/skeleton";

const formatDuration = (totalSeconds: number) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || typeof amount === 'undefined') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
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
    <div className="space-y-2">
      {dialogue && dialogue.length > 0 ? dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn(
            'relative max-w-sm rounded-xl px-4 py-2 shadow break-words leading-relaxed text-sm md:text-base', 
            message.sender === 'user' 
              ? 'bg-primary/20 text-foreground' 
              : 'bg-white/10 border border-white/10 text-foreground/80'
          )}>
            {message.text}
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

const DashboardSkeleton = () => (
  <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 space-y-16">
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-center"
    >
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
      <div className="mt-6 flex justify-center gap-4">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Skeleton className="h-96 w-full rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </section>
);


export function AnalyticsDashboardClient() {
  const { analytics, isLoading, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    if (!analytics) {
      fetchAnalytics();
    }
  }, [analytics, fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  if (isLoading && !analytics) {
    return <DashboardSkeleton />;
  }
  
  const { voice_analytics, chat_analytics, voiceChartData, chatChartData } = analytics || {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0, total_duration_seconds: 0, total_cost: 0, average_cost: 0 }, recent_calls: [] },
    chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
    voiceChartData: [],
    chatChartData: [],
  };

  const isDataEmpty = !analytics || (
    voice_analytics.summary.total_calls === 0 &&
    chat_analytics.summary.total_sessions === 0 &&
    voice_analytics.recent_calls.length === 0 &&
    chat_analytics.recent_sessions.length === 0
  );

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
              {isLoading ? <RefreshCw className="w-12 h-12 text-accent animate-spin" /> : <Info className="w-12 h-12 text-accent" />}
            </div>
            <h2 className="font-headline text-3xl font-semibold text-white tracking-tight" style={{ textShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
              {isLoading ? "Fetching Latest Data..." : "Awaiting Your First Interaction"}
            </h2>
            <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
              {isLoading 
                ? "Hold on while we gather the latest analytics for you."
                : "Your analytics dashboard is live. As soon as your AI agents handle their first calls or chats, this page will populate with insights."
              }
            </p>
            <div className="mt-6">
                <Button onClick={handleRefresh} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30" disabled={isLoading}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                    Check for New Data
                </Button>
            </div>
          </Card>
        </motion.div>
      </section>
    );
  }

  const voiceChartConfig = { calls: { label: "Calls", color: "hsl(var(--primary))" } } satisfies ChartConfig;
  const chatChartConfig = { sessions: { label: "Sessions", color: "hsl(var(--accent))" } } satisfies ChartConfig;

  const pieChartData = [
    { name: 'Voice Calls', value: voice_analytics.summary.total_calls, fill: 'hsl(var(--primary))' },
    { name: 'Chat Sessions', value: chat_analytics.summary.total_sessions, fill: 'hsl(var(--accent))' },
  ].filter(d => d.value > 0);
  
  const totalInteractions = pieChartData.reduce((sum, item) => sum + item.value, 0);

  const pieChartConfig = {
    calls: { label: 'Voice Calls', color: 'hsl(var(--primary))' },
    chats: { label: 'Chat Sessions', color: 'hsl(var(--accent))' },
  } satisfies ChartConfig;


  return (
    <TooltipProvider>
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 space-y-16">
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
                <Button onClick={handleRefresh} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30" disabled={isLoading}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                    Refresh Data
                </Button>
                <Button onClick={handleExport} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>
          </motion.div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <UiTooltip>
                  <TooltipTrigger asChild>
                      <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                              <Phone className="h-5 w-5 text-primary" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-3xl font-bold">{voice_analytics.summary.total_calls}</div>
                              <p className="text-xs text-muted-foreground">Avg. Duration: {formatDuration(voice_analytics.summary.average_duration_seconds)}</p>
                          </CardContent>
                      </MotionCard>
                  </TooltipTrigger>
                  <UiTooltipContent><p>Total number of voice agent calls handled.</p></UiTooltipContent>
              </UiTooltip>
              <UiTooltip>
                <TooltipTrigger asChild>
                    <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <MessageSquare className="h-5 w-5 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{chat_analytics.summary.total_sessions}</div>
                            <p className="text-xs text-muted-foreground">Avg. Messages: {Math.round(chat_analytics.summary.average_message_count)}</p>
                        </CardContent>
                    </MotionCard>
                </TooltipTrigger>
                <UiTooltipContent><p>Total number of chat agent sessions handled.</p></UiTooltipContent>
              </UiTooltip>
              <UiTooltip>
                <TooltipTrigger asChild>
                    <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Call Cost</CardTitle>
                            <DollarSign className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(voice_analytics.summary.total_cost)}</div>
                            <p className="text-xs text-muted-foreground">Avg. Cost/Call: {formatCurrency(voice_analytics.summary.average_cost)}</p>
                        </CardContent>
                    </MotionCard>
                </TooltipTrigger>
                <UiTooltipContent><p>Total estimated cost for all voice calls.</p></UiTooltipContent>
              </UiTooltip>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                <CardHeader>
                  <CardTitle>Call Volume (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  {voiceChartData && voiceChartData.length > 0 ? (
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No call data available for the selected period.</p>
                  )}
                </CardContent>
              </MotionCard>
              
               <UiTooltip>
                  <TooltipTrigger asChild>
                    <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Interaction Mix</CardTitle>
                            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center">
                            {pieChartData.length > 0 ? (
                                <ChartContainer config={pieChartConfig} className="h-full w-full">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <ChartTooltip cursor={{}} content={<ChartTooltipContent hideLabel />} />
                                            <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%" strokeWidth={2}>
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Legend content={({ payload }) => (
                                                <div className="flex justify-center items-center gap-4 text-xs mt-2 text-muted-foreground">
                                                {payload?.map((entry, index) => (
                                                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span>{entry.value}</span>
                                                    <span className="font-semibold text-foreground">
                                                        {`${Math.round(((entry.payload?.value || 0) / totalInteractions) * 100)}%`}
                                                    </span>
                                                    </div>
                                                ))}
                                                </div>
                                            )} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (<p className="text-xs text-muted-foreground text-center pt-6">No interactions yet.</p>)}
                        </CardContent>
                    </MotionCard>
                  </TooltipTrigger>
                  <UiTooltipContent><p>Breakdown of interactions between voice and chat.</p></UiTooltipContent>
              </UiTooltip>

              <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}>
                <CardHeader>
                  <CardTitle>Chat Volume (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  {chatChartData && chatChartData.length > 0 ? (
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No chat data available for the selected period.</p>
                  )}
                </CardContent>
              </MotionCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}>
                  <CardHeader>
                      <CardTitle>Recent Calls</CardTitle>
                      <CardDescription>Review transcripts from the latest calls.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full space-y-2">
                          {voice_analytics.recent_calls.length > 0 ? voice_analytics.recent_calls.map((call, index) => (
                              <AccordionItem value={`call-${index}`} key={index} className="bg-black/20 border-white/10 rounded-lg data-[state=closed]:bg-transparent data-[state=open]:bg-black/30">
                                  <AccordionTrigger className="p-3 text-sm hover:no-underline hover:bg-white/5 rounded-lg w-full text-left">
                                      <div className="flex justify-between items-center w-full">
                                          <div className="flex items-center gap-2">
                                              {call.status === 'completed' && <CheckCircle className="w-4 h-4 text-primary" />}
                                              <div>
                                                  <div className="text-sm text-gray-300">{formatTimestamp(call.started_at)}</div>
                                                  <div className="text-xs text-muted-foreground capitalize">{call.from_number} - {call.status}</div>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2 text-muted-foreground text-xs bg-black/20 px-2 py-1 rounded-full">
                                              <Clock className="w-3 h-3" />
                                              <span>{formatDuration(call.duration)}</span>
                                              {typeof call.price !== 'undefined' && call.price > 0 && (
                                                  <>
                                                      <span className="mx-1 text-muted-foreground/50">|</span>
                                                      <DollarSign className="w-3 h-3" />
                                                      <span>{formatCurrency(call.price)}</span>
                                                  </>
                                              )}
                                          </div>
                                      </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="p-4 pt-0">
                                      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-md border border-white/10 overflow-hidden">
                                        <ScrollArea className="h-60 p-4">
                                            <pre className="text-sm text-foreground/80 font-body whitespace-pre-wrap leading-relaxed">{call.transcript || "No transcript available."}</pre>
                                        </ScrollArea>
                                      </div>
                                  </AccordionContent>
                              </AccordionItem>
                          )) : <div className="p-6 text-center text-sm text-gray-300">No recent calls found.</div>}
                      </Accordion>
                  </CardContent>
              </MotionCard>
              
              <MotionCard variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }}>
                  <CardHeader>
                      <CardTitle>Recent Chat Sessions</CardTitle>
                      <CardDescription>Review dialogues from the latest sessions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full space-y-2">
                          {chat_analytics.recent_sessions.length > 0 ? chat_analytics.recent_sessions.map((session, index) => (
                              <AccordionItem value={`session-${index}`} key={index} className="bg-black/20 border-white/10 rounded-lg data-[state=closed]:bg-transparent data-[state=open]:bg-black/30">
                                  <AccordionTrigger className="p-3 text-sm hover:no-underline hover:bg-white/5 rounded-lg w-full text-left">
                                      <div className="flex justify-between items-center w-full">
                                          <div className="text-sm text-gray-300">{formatTimestamp(session.started_at)}</div>
                                          <div className="flex items-center gap-2 text-muted-foreground text-xs bg-black/20 px-2 py-1 rounded-full">
                                              <Clock className="w-3 h-3" />
                                              {formatDuration(session.duration)}
                                          </div>
                                      </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="p-4 pt-0">
                                    <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-md border border-white/10 overflow-hidden">
                                      <ScrollArea className="h-60 p-4">
                                          <ChatDialogue dialogue={session.dialogue} />
                                      </ScrollArea>
                                    </div>
                                  </AccordionContent>
                              </AccordionItem>
                          )) : <div className="p-6 text-center text-sm text-gray-300">No recent sessions found.</div>}
                      </Accordion>
                  </CardContent>
              </MotionCard>
          </div>
      </section>
    </TooltipProvider>
  );
}
