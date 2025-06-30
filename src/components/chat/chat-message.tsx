import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex items-start gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-[#1E5028] text-white">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs md:max-w-sm rounded-2xl px-4 py-2 text-sm',
          isUser
            ? 'bg-[#1E5028] text-white rounded-br-lg'
            : 'bg-[#9BFFD5] text-[#1E5028] rounded-bl-lg'
        )}
      >
        {typeof content === 'string' ? <p className="whitespace-pre-wrap">{content}</p> : content}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted-foreground/20 text-card-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
