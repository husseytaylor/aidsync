"use client";

import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  sender: 'user' | 'bot';
  text: ReactNode;
}

export function ChatMessage({ sender, text }: ChatMessageProps) {
  const isUser = sender === 'user';

  return (
    <motion.div
      className={cn('flex items-start gap-3', isUser && 'justify-end')}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'relative max-w-xs md:max-w-sm rounded-2xl px-3.5 py-2 shadow-md font-medium text-sm whitespace-pre-wrap break-words',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-gradient-to-br from-card to-secondary/80 text-card-foreground'
        )}
      >
        {text}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted-foreground/20 text-card-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
