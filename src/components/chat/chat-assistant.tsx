
"use client";

import { useState, useRef, useEffect } from 'react';
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
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const WEBHOOK_SESSION_URL = 'https://bridgeboost.app.n8n.cloud/webhook/cdbe668e-7adf-4014-93b7-daad66d8df28';
const FIRST_ASSISTANT_PROMPT = "Hi there! I’m AidSync’s AI Assistant — how can I help today?";

const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-2 bg-foreground/10 rounded-full w-fit">
    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
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

  const endChatSession = async (currentMessages: Message[]) => {
    if (!currentMessages.length || !sessionId || !sessionStartTime) return;
    
    // Don't log sessions that only have the initial bot prompt
    if (currentMessages.length <= 1) return;

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
      await fetch(WEBHOOK_SESSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true, // Ensures the request is sent even if the page is closing
      });
    } catch (error) {
      console.error('[Chat Widget] Failed to send full chat session:', error);
    }
  };
  
  const handleOpen = () => {
    if (messages.length === 0) {
      setSessionId(crypto.randomUUID());
      setSessionStartTime(new Date());
      setMessages([
        { sender: 'bot', text: FIRST_ASSISTANT_PROMPT, timestamp: new Date() }
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
    endChatSession(messagesRef.current);
    setIsOpen(false);
    // Reset for next conversation
    setMessages([]);
    setSessionId(null);
    setSessionStartTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { sender: 'user', text: input.trim(), timestamp: new Date() };
    const currentInput = input;
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);
    
    try {
      const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      const botOutput = result.response;
      
      if (botOutput) {
        const botMessage: Message = { sender: 'bot', text: botOutput, timestamp: new Date() };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Invalid response from /api/chat:", result);
        throw new Error('AI assistant returned an empty or invalid response.');
      }

    } catch (error: any) {
      console.error('[Chat Widget] AI chat error:', error);
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
        <Card className="h-[70vh] flex flex-col rounded-2xl border-accent/20 bg-black/70 backdrop-blur-lg shadow-glow-accent">
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
                  <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}
                {isPending && <ChatMessage sender="bot" text={<TypingIndicator />} />}
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
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
