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
}

const WEBHOOK_URL = 'https://bridgeboost.app.n8n.cloud/webhook/51cb5fe7-c357-4517-ba28-b0609ec75fcf';
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This useEffect handles the wiggle animation for the chat button.
  // It triggers every 35 seconds, but only if the chat window is closed.
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const wiggleInterval = setInterval(() => {
      if (!isOpen) {
        setIsWiggling(true);
        timeout = setTimeout(() => {
          setIsWiggling(false);
        }, 400); // Animation duration matches tailwind config
      }
    }, 35000);

    return () => {
      clearInterval(wiggleInterval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);
  
  const restrictedPaths = ['/auth', '/dashboard', '/login', '/signup', '/reset'];

  const sendEvent = async (payload: object) => {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Webhook event failed:', error);
    }
  };
  
  const handleOpen = () => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: FIRST_ASSISTANT_PROMPT }
      ]);
    }
    setIsOpen(true);
  };

  // Event listener to open chat from other components
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
    if (sessionId && sessionStartTime) {
      const duration_seconds = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      sendEvent({
        event: 'chat_closed',
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        message_count: messages.filter(m => m.role === 'user').length,
        history: messages,
        duration_seconds,
      });
    }
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      let currentSessionId = sessionId;
      
      // If this is the first message, initialize the session.
      if (!currentSessionId) {
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
        setSessionStartTime(new Date());
        currentSessionId = newSessionId;
        
        // Send a session start event
        await sendEvent({
          event: 'chat_started',
          session_id: newSessionId,
          timestamp: new Date().toISOString(),
        });
      }
      
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'message',
            session_id: currentSessionId,
            sender: 'user',
            message: currentInput,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error('Webhook request failed');
        
        const result = await response.json();
        const assistantContent = result.response || result.message;

        if (assistantContent) {
          const assistantMessage: Message = { role: 'assistant', content: assistantContent };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error('Empty or invalid response from webhook');
        }
      } catch (error) {
        console.error('AI chat error:', error);
        const errorMessage: Message = { role: 'assistant', content: "I’ll forward this to our team. Please email us or book a call using the link below." };
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
            "flex items-center gap-3 px-5 py-3 bg-aidsync-gradient-green text-white font-semibold rounded-2xl shadow-glow-accent-button transition-transform",
            isWiggling && "animate-wiggle"
          )}
          aria-label="Open AidSync Chat Agent"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Logo className="w-6 h-6" />
          <span className="hidden sm:inline">AidSync Chat Agent</span>
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
