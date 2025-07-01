
"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import { Logo } from '../logo';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AGENT_ANALYTICS_WEBHOOK_URL = process.env.NEXT_PUBLIC_AGENT_ANALYTICS_WEBHOOK_URL;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;
const FIRST_ASSISTANT_PROMPT = "Hi there! I’m AidSync’s AI Assistant — how can I help today?";

const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-2 bg-white/10 rounded-full w-fit">
    <span className="h-2 w-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
  </div>
);

export function ChatAssistant() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const wiggleInterval = setInterval(() => {
      if (!isOpen) {
        setIsWiggling(true);
        timeout = setTimeout(() => {
          setIsWiggling(false);
        }, 400);
      }
    }, 35000);

    return () => {
      clearInterval(wiggleInterval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);
  
  const restrictedPaths = ['/auth', '/dashboard', '/login', '/signup', '/reset'];

  const sendAgentAnalytics = async (history: Message[]) => {
    if (!AGENT_ANALYTICS_WEBHOOK_URL || AGENT_ANALYTICS_WEBHOOK_URL === 'YOUR_AGENT_ANALYTICS_WEBHOOK_URL') {
      // Don't log error to console for user, but we know it's not configured
      return;
    }
    if (!history || history.length === 0) return;
    if (!sessionId || !sessionStartTime || !ORG_ID) return;
    
    if (process.env.NODE_ENV === 'development') {
        console.log('[Agent Analytics] Sending session log to:', AGENT_ANALYTICS_WEBHOOK_URL);
    }

    const durationSeconds = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000);
    const chatHistoryForApi = history.map(msg => ({
      text: msg.content,
      sender: msg.role,
      timestamp: msg.timestamp.toISOString(),
    }));

    const payload = {
      sessionId,
      timestamp: new Date().toISOString(),
      messageCount: history.length,
      durationSeconds,
      domain: window.location.hostname,
      source: "widget",
      org_id: ORG_ID,
      endedByUser: true,
      messages: chatHistoryForApi,
    };

    try {
      // Fire-and-forget this request
      fetch(AGENT_ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      console.error('[Agent Analytics] Failed to send session analytics:', error);
    }
  };
  
  const handleOpen = () => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: FIRST_ASSISTANT_PROMPT, timestamp: new Date() }
      ]);
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const eventHandler = () => handleOpen();
    window.addEventListener('open-aidsync-chat', eventHandler);
    return () => window.removeEventListener('open-aidsync-chat', eventHandler);
  }, []);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
         scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [messages, isOpen]);
  
  if (!isMounted) {
    return null;
  }

  if (restrictedPaths.some(path => pathname.startsWith(path))) {
    return null;
  }
  
  const handleClose = () => {
    if (sessionId) {
      sendAgentAnalytics(messagesRef.current);
    }
    setIsOpen(false);
    // Reset for next conversation
    setMessages([]);
    setSessionId(null);
    setSessionStartTime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    const currentInput = input;
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      if (!sessionId) {
        setSessionId(crypto.randomUUID());
        setSessionStartTime(new Date());
      }

      if (!AGENT_ANALYTICS_WEBHOOK_URL || AGENT_ANALYTICS_WEBHOOK_URL === 'YOUR_AGENT_ANALYTICS_WEBHOOK_URL') {
        console.error('[Chat Widget] Error: Webhook URL is not configured in .env file.');
        const errorMessage: Message = { role: 'assistant', content: "I’m having trouble connecting right now because the chat webhook is not configured.", timestamp: new Date() };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }
      
      try {
        const response = await fetch(AGENT_ANALYTICS_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentInput }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Webhook request failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        const assistantContent = result.response || result.message;

        if (assistantContent) {
          const assistantMessage: Message = { role: 'assistant', content: assistantContent, timestamp: new Date() };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error('AI assistant returned an empty or invalid response from webhook.');
        }

      } catch (error: any) {
        console.error('[Chat Widget] AI chat error:', error);
        const errorMessage: Message = { role: 'assistant', content: "I’m having trouble connecting right now. Please try again later.", timestamp: new Date() };
        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };

  return (
    <>
      <div className={cn(
          "fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out transform-gpu will-change-transform",
          isOpen ? "scale-0" : "scale-100"
        )}>
        <motion.button
          onClick={handleOpen}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-card px-6 py-3 font-headline text-sm font-semibold tracking-tight text-white shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] sm:text-base",
            isWiggling && "animate-wiggle"
          )}
          aria-label="Open AidSync Chat Agent"
        >
          <Logo className="w-8 h-8" />
          <span>AidSync Chat Agent</span>
        </motion.button>
      </div>

      <div className={cn(
          "fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] max-w-md transition-all duration-300 ease-in-out",
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      )}>
        <Card className="h-[70vh] flex flex-col shadow-2xl rounded-2xl border-[1.5px] border-white/10 bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-lg transition-shadow duration-300 hover:shadow-glow-accent">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <CardTitle className="font-headline text-lg text-secondary-foreground">AidSync AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-secondary-foreground hover:bg-white/10 focus-visible:ring-ring">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
                {isPending && <ChatMessage role="assistant" content={<TypingIndicator />} />}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4 border-white/10">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isPending}
                autoFocus
                className="bg-black/20 backdrop-blur-sm border-white/20"
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
