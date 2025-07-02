
"use client";

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import { Logo } from '../logo';
import { motion } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const RESPONSE_WEBHOOK_URL = '/api/chat';
const SESSION_WEBHOOK_URL = 'https://bridgeboost.app.n8n.cloud/webhook/cdbe668e-7adf-4014-93b7-daad66d8df28';
const FIRST_ASSISTANT_PROMPT = "Hi there! I’m AidSync’s AI Assistant — how can I help today?";

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse"></span>
  </div>
);

export function ChatAssistant() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const messagesRef = useRef(messages);
  const [scrollLocked, setScrollLocked] = useState(true);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setIsMounted(true);
    const storedSessionId = localStorage.getItem('chat_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const viewport = scrollAreaRef.current;
    if (!viewport) return;
    const timeout = setTimeout(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }, 10);
    return () => clearTimeout(timeout);
  }, [isMounted, isOpen]);

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

  const endChatSession = async (currentMessages: Message[]) => {
    if (!currentMessages.length || !sessionId || !sessionStartTime || currentMessages.length <= 1) return;

    const endedAt = new Date();
    const durationSeconds = Math.round((endedAt.getTime() - sessionStartTime.getTime()) / 1000);

    const payload = {
      body: {
        sessionId: sessionId,
        chatHistory: currentMessages.map(msg => ({
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp.toISOString(),
        })),
        messageCount: currentMessages.length,
        durationSeconds: durationSeconds,
        endedByUser: true,
        domain: window.location.hostname,
      }
    };

    try {
      await fetch(SESSION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      console.error('[Chat Widget] Failed to send full chat session:', error);
    }
  };
  
  const handleOpen = useCallback(() => {
    if (messages.length === 0) {
      let currentSessionId = localStorage.getItem('chat_session_id');
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        setSessionId(currentSessionId);
        localStorage.setItem('chat_session_id', currentSessionId);
      } else {
        setSessionId(currentSessionId);
      }
      setSessionStartTime(new Date());
      setMessages([
        { sender: 'bot', text: FIRST_ASSISTANT_PROMPT, timestamp: new Date() }
      ]);
    }
    setIsOpen(true);
  }, [messages.length]);

  useEffect(() => {
    const eventHandler = () => handleOpen();
    window.addEventListener('open-aidsync-chat', eventHandler);
    return () => window.removeEventListener('open-aidsync-chat', eventHandler);
  }, [handleOpen]);

  useEffect(() => {
    const viewport = scrollAreaRef.current;
    if (!viewport) return;

    const handleUserScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        setScrollLocked(isAtBottom);
    };

    viewport.addEventListener('scroll', handleUserScroll);
    return () => {
        viewport.removeEventListener('scroll', handleUserScroll);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !scrollLocked) return;
    const viewport = scrollAreaRef.current;
    if (!viewport) return;
    const timeoutId = setTimeout(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isOpen, scrollLocked]);
  
  if (!isMounted) {
    return null;
  }

  if (restrictedPaths.some(path => pathname.startsWith(path))) {
    return null;
  }
  
  const handleClose = () => {
    endChatSession(messagesRef.current);
    setIsOpen(false);
    setMessages([]);
    setSessionId(null);
    setSessionStartTime(null);
    localStorage.removeItem('chat_session_id');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isPending || !sessionId) return;

    const userMessage: Message = { sender: 'user', text: currentInput, timestamp: new Date() };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);
    
    try {
      const response = await fetch(RESPONSE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: currentInput,
            session_id: sessionId,
          }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`[API /chat] Webhook failed with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      const botOutput = Array.isArray(result) ? result[0]?.output : result.response;
      
      if (botOutput) {
        const botMessage: Message = { sender: 'bot', text: botOutput, timestamp: new Date() };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Invalid response from webhook:", result);
        throw new Error('AI assistant returned an empty or invalid response.');
      }

    } catch (error: any) {
      console.error('[Chat Widget] AI chat error:', error.message);
      const errorMessage: Message = { sender: 'bot', text: "I’m having trouble connecting right now. Please try again later.", timestamp: new Date() };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
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
            "flex items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-card px-6 py-3 font-headline text-sm font-semibold tracking-tight text-foreground shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-glow-accent sm:text-base",
            isWiggling && "animate-wiggle"
          )}
          aria-label="Open AidSync Chat Agent"
        >
          <Logo className="w-8 h-8" />
          <span>AidSync Chat Agent</span>
        </motion.button>
      </div>

      <motion.div
        className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] max-w-sm"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="h-[70vh] flex flex-col rounded-2xl border-accent/20 bg-black/35 backdrop-blur-xl shadow-[0_8px_24px_rgba(72,209,204,0.25)] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={cn("relative", isPending && "after:absolute after:inset-0 after:rounded-full after:ring-2 after:ring-accent after:animate-pulse")}>
                 <Logo className="w-7 h-7" />
              </div>
              <CardTitle className="font-headline text-lg text-secondary-foreground">AidSync AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-secondary-foreground hover:bg-accent/10 hover:text-accent focus-visible:ring-ring">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
             <div className="flex-1 overflow-y-auto p-3 space-y-4" ref={scrollAreaRef}>
              {messages.map((msg, index) => (
                <ChatMessage key={index} sender={msg.sender} text={msg.text} />
              ))}
              {isPending && <ChatMessage sender="bot" text={<TypingIndicator />} />}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4 border-white/10">
            <form onSubmit={handleSubmit} className="relative flex w-full items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isPending}
                autoFocus
                className="pr-12 rounded-full"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost"
                disabled={isPending || !input.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full transition-transform hover:scale-110 hover:bg-accent/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </div>
      </motion.div>
    </>
  );
}

    