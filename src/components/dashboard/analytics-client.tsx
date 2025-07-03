
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Bot, User, RefreshCw, Download, Info, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useAnalytics } from "@/context/analytics-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isToday, isThisWeek, parseISO } from "date-fns";

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
  try {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const ChatDialogue = React.memo(({ dialogue }: { dialogue: { sender: string; text: string }[] }) => (
    <div className="space-y-3 p-2">
      {dialogue && dialogue.length > 0 ? dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn(
            'relative max-w-sm rounded-xl px-4 py-2 shadow break-words leading-relaxed text-sm md:text-base', 
            message.sender === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-card text-foreground border border-accent/50 shadow-md'
          )}>
            {message.text}
          </div>
          {message.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 text-gray-300 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      )) : <p className="text-muted-foreground text-center">No dialogue found.</p>}
    </div>
));
ChatDialogue.displayName = 'ChatDialogue';

const MotionCard = motion(Card);
const MotionDiv = motion.div;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const DashboardSkeleton = () => (
  <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
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
  const [isMounted, setIsMounted] = useState(false);
  const [fullyExpandedChats, setFullyExpandedChats] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    dateRange: '30d',
    interactionType: 'all',
  });
  
  const callItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chatItemRefs = useRef<(HTMLDivElement | null)[]>([]);


  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCalls = () => {
    const data = filteredAnalytics?.voice_analytics?.recent_calls;
    if (!data || data.length === 0) {
      alert("No call data to export.");
      return;
    };
    
    const headers = "Caller,Call Type,Status,Duration (s),Cost ($),Transcript";
    const rows = data.map(call => {
      const rowData = [
        call.from_number,
        'incoming',
        call.status,
        call.duration,
        call.price || 0,
        `"${(call.transcript || '').replace(/"/g, '""')}"`
      ];
      return rowData.join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    downloadCSV(csvContent, 'aidsync_call_logs.csv');
  };

  const handleExportChats = () => {
    const data = filteredAnalytics?.chat_analytics?.recent_sessions;
    if (!data || data.length === 0) {
      alert("No chat data to export.");
      return;
    }
    
    const headers = "Session ID,Start Time,Message Count,Transcript";
    const rows = data.map(session => {
      const transcript = session.dialogue.map(msg => `${msg.sender}: ${msg.text}`).join('; ');
      const rowData = [
        session.id || 'N/A',
        formatTimestamp(session.started_at),
        session.dialogue.length,
        `"${transcript.replace(/"/g, '""')}"`
      ];
      return rowData.join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    downloadCSV(csvContent, 'aidsync_chat_logs.csv');
  };

  useEffect(() => {
    setIsMounted(true);
    const savedFilters = localStorage.getItem("aidsyncDashboardFilters");
    if (savedFilters) {
      try {
        setFilters(JSON.parse(savedFilters));
      } catch (e) {
        console.error("Failed to parse filters from localStorage", e);
      }
    }
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("aidsyncDashboardFilters", JSON.stringify(filters));
    }
  }, [filters, isMounted]);

  const filteredAnalytics = useMemo(() => {
    if (!analytics) return null;

    const filterByDate = (item: { started_at: string }) => {
      try {
        const itemDate = parseISO(item.started_at);
        if (filters.dateRange === '7d') return isThisWeek(itemDate, { weekStartsOn: 1 });
        if (filters.dateRange === 'today') return isToday(itemDate);
        return true; // for 30d
      } catch(e) {
        return true; 
      }
    };

    return {
      ...analytics,
      voice_analytics: {
        ...analytics.voice_analytics,
        recent_calls: analytics.voice_analytics.recent_calls.filter(filterByDate),
      },
      chat_analytics: {
        ...analytics.chat_analytics,
        recent_sessions: analytics.chat_analytics.recent_sessions.filter(filterByDate),
      },
    };
  }, [analytics, filters.dateRange]);

  const { voice_analytics, chat_analytics, voiceChartData, chatChartData } = filteredAnalytics || {
    voice_analytics: { summary: { total_calls: 0, average_duration_seconds: 0, total_duration_seconds: 0, total_cost: 0, average_cost: 0 }, recent_calls: [] },
    chat_analytics: { summary: { total_sessions: 0, average_duration_seconds: 0, average_message_count: 0 }, recent_sessions: [] },
    voiceChartData: [],
    chatChartData: [],
  };

  const combinedChartData = useMemo(() => {
    if (!voiceChartData || !chatChartData) return [];

    const allDates = Array.from(new Set([...voiceChartData.map(d => d.date), ...chatChartData.map(d => d.date)]));
    
    try {
      allDates.sort((a, b) => new Date(a + `, ${new Date().getFullYear()}`).getTime() - new Date(b + `, ${new Date().getFullYear()}`).getTime());
    } catch (e) {
      console.error("Could not sort chart dates:", e);
    }
    
    return allDates.map(date => {
      const voiceEntry = voiceChartData.find(d => d.date === date);
      const chatEntry = chatChartData.find(d => d.date === date);
      return {
        date,
        calls: voiceEntry?.calls || 0,
        sessions: chatEntry?.sessions || 0,
      };
    });
  }, [voiceChartData, chatChartData]);

  const pieChartData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Voice Calls', value: voice_analytics.summary.total_calls, fill: 'hsl(var(--primary))' },
      { name: 'Chat Sessions', value: chat_analytics.summary.total_sessions, fill: 'hsl(var(--accent))' },
    ].filter(d => d.value > 0);
  }, [analytics, voice_analytics.summary.total_calls, chat_analytics.summary.total_sessions]);

  const totalInteractions = useMemo(() => {
    return pieChartData.reduce((sum, item) => sum + item.value, 0);
  }, [pieChartData]);
  
  const handleToggleChatExpansion = (index: number) => {
    setFullyExpandedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRefresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  
  const handleAccordionChange = useCallback((value: string) => {
    if (!value) return; 

    const [type, indexStr] = value.split('-');
    const index = parseInt(indexStr, 10);
    const refArray = type === 'session' ? chatItemRefs.current : callItemRefs.current;
    
    setTimeout(() => {
        refArray[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }, 300);
  }, []);


  if (!isMounted || (isLoading && !analytics)) {
    return <DashboardSkeleton />;
  }
  
  const isDataEmpty = !analytics || (
    analytics.voice_analytics.recent_calls.length === 0 &&
    analytics.chat_analytics.recent_sessions.length === 0
  );

  if (isDataEmpty) {
    return (
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20 space-y-16 flex flex-col items-center justify-center min-h-[60vh]">
        <MotionDiv
          variants={cardVariants}
          initial="hidden"
          animate="visible"
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
        </MotionDiv>
      </section>
    );
  }

  const combinedChartConfig = {
    calls: { label: "Calls", color: "hsl(var(--primary))" },
    sessions: { label: "Sessions", color: "hsl(var(--accent))" },
  } satisfies ChartConfig;

  const pieChartConfig = {
    calls: { label: 'Voice Calls', color: 'hsl(var(--primary))' },
    chats: { label: 'Chat Sessions', color: 'hsl(var(--accent))' },
  } satisfies ChartConfig;


  return (
    <TooltipProvider>
      <motion.section 
        className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8 py-20 space-y-8"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
          <MotionDiv
              variants={cardVariants}
              className="text-center mb-8"
          >
            <h1 className="font-headline text-4xl md:text-5xl font-semibold text-white tracking-tight" style={{ textShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
              AidSync Agent Insights
            </h1>
            <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
              Live metrics from your customer-facing AI chat and voice agents.
            </p>
          </MotionDiv>
          
          <MotionDiv variants={cardVariants} className="flex flex-wrap items-center justify-between gap-4 mb-8">
             <div className="flex gap-4">
                 <Button onClick={handleRefresh} variant="outline" className="bg-black/20 border-white/20 hover:bg-white/30" disabled={isLoading}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                    Refresh Data
                </Button>
             </div>
             <div className="flex flex-col sm:flex-row gap-4">
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(f => ({ ...f, dateRange: value }))}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={filters.interactionType} onValueChange={(value) => setFilters(f => ({ ...f, interactionType: value }))}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Interaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Interactions</SelectItem>
                        <SelectItem value="chat">Chat Only</SelectItem>
                        <SelectItem value="voice">Voice Only</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </MotionDiv>

          <MotionDiv variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <UiTooltip>
              <TooltipTrigger asChild>
                <MotionCard>
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
                <MotionCard>
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
                <MotionCard>
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
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <MotionCard variants={cardVariants} className={cn("lg:col-span-2", filters.interactionType !== 'all' && 'lg:col-span-3')}>
              <CardHeader>
                <CardTitle>Interaction Volume (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {combinedChartData && combinedChartData.length > 0 ? (
                  <ChartContainer config={combinedChartConfig} className="h-full w-full">
                    <ResponsiveContainer>
                      <LineChart data={combinedChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsla(var(--border), 0.3)" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} className="text-xs text-slate-300" />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} allowDecimals={false} className="text-xs text-slate-300" />
                        <ChartTooltip cursor={{ stroke: "hsl(var(--accent))", strokeDasharray: "3 3" }} content={<ChartTooltipContent indicator="dot" />} />
                        <Legend />
                        {filters.interactionType !== 'chat' && <Line dataKey="calls" name="Voice Calls" type="monotone" stroke="var(--color-calls)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-calls)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-calls)' }} />}
                        {filters.interactionType !== 'voice' && <Line dataKey="sessions" name="Chat Sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={{ r: 2, fill: 'var(--color-sessions)' }} activeDot={{ r: 6, strokeWidth: 1, fill: 'hsl(var(--background))', stroke: 'var(--color-sessions)' }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">No interaction data available for the selected period.</p>
                )}
              </CardContent>
            </MotionCard>
            {filters.interactionType === 'all' && <MotionCard variants={cardVariants}>
              <CardHeader>
                  <CardTitle>Interaction Mix</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
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
                                      <div className="flex justify-center items-center gap-4 text-sm mt-4 text-muted-foreground">
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
                  ) : (<p className="text-sm text-muted-foreground text-center">No interactions yet.</p>)}
              </CardContent>
            </MotionCard>}
          </div>

          <div className="flex flex-col gap-10 mt-8">
              {filters.interactionType !== 'chat' && <MotionCard variants={cardVariants}>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recent Calls</CardTitle>
                        <CardDescription>Review transcripts from the latest calls.</CardDescription>
                      </div>
                      <Button onClick={handleExportCalls} variant="outline" size="sm" className="bg-black/20 border-white/20 hover:bg-white/30">
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                      </Button>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full space-y-4" onValueChange={handleAccordionChange}>
                          {voice_analytics.recent_calls.length > 0 ? voice_analytics.recent_calls.slice(0, 10).map((call, index) => (
                              <AccordionItem value={`call-${index}`} key={call.id || index} ref={el => (callItemRefs.current[index] = el)}>
                                  <AccordionTrigger>
                                      <div className="flex justify-between items-center w-full">
                                          <div className="flex items-center gap-3">
                                              {call.status === 'completed' && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                                              <div>
                                                  <div className="text-sm">{formatTimestamp(call.started_at)}</div>
                                                  <div className="text-xs text-muted-foreground/80 capitalize">{call.from_number} - {call.status}</div>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2 text-foreground/80 text-xs bg-black/20 px-2 py-1 rounded-full">
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
                                  <AccordionContent>
                                    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden mt-2 p-1">
                                      <ScrollArea className="h-60 p-4">
                                          <pre className="text-sm text-foreground/80 font-body whitespace-pre-wrap leading-relaxed">{call.transcript || "No transcript available."}</pre>
                                      </ScrollArea>
                                    </div>
                                  </AccordionContent>
                              </AccordionItem>
                          )) : <div className="p-6 text-center text-sm text-gray-300">No recent calls found for the selected period.</div>}
                      </Accordion>
                  </CardContent>
              </MotionCard>}
              
              {filters.interactionType !== 'voice' && <MotionCard variants={cardVariants}>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recent Chat Sessions</CardTitle>
                        <CardDescription>Review dialogues from the latest sessions.</CardDescription>
                      </div>
                      <Button onClick={handleExportChats} variant="outline" size="sm" className="bg-black/20 border-white/20 hover:bg-white/30">
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                      </Button>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="single" collapsible className="w-full space-y-4" onValueChange={handleAccordionChange}>
                          {chat_analytics.recent_sessions.length > 0 ? chat_analytics.recent_sessions.slice(0, 10).map((session, index) => {
                            const isExpanded = fullyExpandedChats.has(index);
                            return (
                              <AccordionItem value={`session-${index}`} key={session.id || index} ref={el => (chatItemRefs.current[index] = el)}>
                                  <AccordionTrigger>
                                      <div className="flex justify-between items-center w-full">
                                          <div className="text-sm">{formatTimestamp(session.started_at)}</div>
                                          <div className="flex items-center gap-2 text-foreground/80 text-xs bg-black/20 px-2 py-1 rounded-full">
                                              <Clock className="w-3 h-3" />
                                              <span>{formatDuration(session.duration)}</span>
                                                <span className="mx-1 text-muted-foreground/50">|</span>
                                              <MessageSquare className="w-3 h-3" />
                                              <span>{session.dialogue.length} msgs</span>
                                          </div>
                                      </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-md border border-white/10 overflow-hidden mt-2">
                                      <ScrollArea className={cn("chat-scrollbar", isExpanded ? 'h-auto' : 'h-60')}>
                                          <ChatDialogue dialogue={session.dialogue} />
                                      </ScrollArea>
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        <Button
                                          size="sm"
                                          onClick={() => handleToggleChatExpansion(index)}
                                          className="bg-accent text-accent-foreground hover:bg-accent/80 transition rounded-md px-3 py-1 font-medium"
                                        >
                                          {isExpanded ? 'Collapse Transcript' : 'View Full Transcript'}
                                        </Button>
                                    </div>
                                  </AccordionContent>
                              </AccordionItem>
                            )
                          }) : <div className="p-6 text-center text-sm text-gray-300">No recent sessions found for the selected period.</div>}
                      </Accordion>
                  </CardContent>
              </MotionCard>}
          </div>
      </motion.section>
    </TooltipProvider>
  );
}
