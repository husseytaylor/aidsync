"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import { Logo } from '../logo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WEBHOOK_URL = 'https://bridgeboost.app.n8n.cloud/webhook/51cb5fe7-c357-4517-ba28-b0609ec75fcf';

export function ChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  
  const restrictedPaths = ['/auth', '/dashboard', '/login', '/signup', '/reset'];
  if (restrictedPaths.some(path => pathname.startsWith(path))) {
    return null;
  }

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
    if (!sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      setSessionStartTime(new Date());

      sendEvent({
        event: 'chat_opened',
        session_id: newSessionId,
        timestamp: new Date().toISOString(),
      });

      if (messages.length === 0) {
        setMessages([
          { role: 'assistant', content: 'Hi there! I’m AidSync’s AI Assistant — how can I help today?' }
        ]);
      }
    }
    setIsOpen(true);
  };
  
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
    if (!input.trim() || isPending || !sessionId) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'message',
            session_id: sessionId,
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
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? "scale-0" : "scale-100")}>
        <Button 
          size="icon"
          className="rounded-full w-16 h-16 shadow-lg bg-primary/80 backdrop-blur-md border border-primary hover:bg-primary"
          onClick={handleOpen}
          aria-label="Open AI Assistant"
        >
          <Logo className="w-10 h-10" />
        </Button>
      </div>

      <div className={cn(
          "fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] max-w-md transition-all duration-300 ease-in-out",
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      )}>
        <Card className="h-[70vh] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <CardTitle className="font-headline text-lg text-secondary-foreground">AidSync AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                  <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
                {isPending && <ChatMessage role="assistant" content={<Loader2 className="w-5 h-5 animate-spin text-primary" />} />}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isPending}
                autoFocus
                className="bg-background/50 backdrop-blur-sm"
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
