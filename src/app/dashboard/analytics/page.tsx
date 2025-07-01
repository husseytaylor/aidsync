import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Clock, MessageSquare, BarChartHorizontal, Timer, Calendar, Bot, User } from 'lucide-react';
import { cn } from "@/lib/utils";

// In a real application, this data would be fetched from a secure, authenticated API endpoint.
// For demonstration purposes, we are using mock data that matches the specified webhook payload structure.
async function getAnalyticsData() {
  const mockAnalyticsData = {
    voice_analytics: {
      summary: {
        total_calls: 152,
        average_duration_seconds: 124,
      },
      recent_calls: [
        { started_at: '2024-07-25T22:54:59Z', duration: 95, transcript: 'User: Hello, I need help with my account. Agent: Of course, how can I assist you today?' },
        { started_at: '2024-07-25T21:30:10Z', duration: 180, transcript: 'User: I would like to know more about your pricing. Agent: I can help with that. Our pricing tiers are Starter at $2,500 setup and $950 per month, Growth at $4,500 setup and $1,500 per month, and Command Suite at $7,000 setup and $2,500 per month.' },
        { started_at: '2024-07-24T18:45:12Z', duration: 62, transcript: 'User: Can I book a discovery call? Agent: Yes, you can book a call directly on our website under the contact section.' },
      ],
    },
    chat_analytics: {
      summary: {
        total_sessions: 340,
        average_duration_seconds: 255,
        average_message_count: 8,
      },
      recent_sessions: [
        {
          started_at: '2024-07-25T23:10:05Z',
          duration: 300,
          dialogue: [
            { sender: 'user', text: 'Hi, can you help me upgrade my plan?' },
            { sender: 'assistant', text: 'Certainly! I can guide you through that. Which plan are you interested in?' },
            { sender: 'user', text: 'The Growth tier.' },
            { sender: 'assistant', text: 'Great choice. The Growth tier includes the AI chat widget and a 24/7 voice agent.' },
          ],
        },
        {
          started_at: '2024-07-25T20:05:45Z',
          duration: 150,
          dialogue: [
            { sender: 'user', text: 'What are your business hours?' },
            { sender: 'assistant', text: 'We are available 24/7 through our AI assistants. For human support, our team is available from 9 AM to 5 PM, Monday to Friday.' },
          ],
        },
      ],
    },
  };
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAnalyticsData;
}

const formatDuration = (totalSeconds: number) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const ChatDialogue = ({ dialogue }: { dialogue: { sender: string; text: string }[] }) => (
    <div className="space-y-4 rounded-lg p-4 bg-black/20">
      {dialogue.map((message, index) => (
        <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' && 'justify-end')}>
          {message.sender === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
          )}
          <div className={cn('relative max-w-xs rounded-xl px-4 py-2 text-sm shadow', message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground' )}>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
          {message.sender === 'user' && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>
      ))}
    </div>
);


export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  const { voice_analytics, chat_analytics } = analyticsData;

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      {/* Voice Analytics Column */}
      <div className="space-y-8">
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
              <Phone />
              Voice Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Total Calls</h3>
              <p className="text-2xl font-semibold text-white">{voice_analytics.summary.total_calls}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Average Duration</h3>
              <p className="text-2xl font-semibold text-white">{formatDuration(voice_analytics.summary.average_duration_seconds)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Recent Calls</CardTitle>
            <CardDescription>Review transcripts from the latest calls.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {voice_analytics.recent_calls.map((call, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 border-white/10 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between w-full items-center text-sm">
                       <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(call.started_at)}</div>
                       <div className="flex items-center gap-2 text-muted-foreground"><Timer className="w-4 h-4" /> {formatDuration(call.duration)}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2 pb-4 whitespace-pre-wrap">{call.transcript}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Chat Analytics Column */}
      <div className="space-y-8">
        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
              <MessageSquare />
              Chat Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Total Sessions</h3>
              <p className="text-2xl font-semibold text-white">{chat_analytics.summary.total_sessions}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Duration</h3>
              <p className="text-2xl font-semibold text-white">{formatDuration(chat_analytics.summary.average_duration_seconds)}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wide">Avg. Messages</h3>
              <p className="text-2xl font-semibold text-white">{chat_analytics.summary.average_message_count}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-[#00332f]/80 to-[#00110f]/80 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Recent Chat Sessions</CardTitle>
            <CardDescription>Review dialogues from the latest sessions.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full space-y-2">
              {chat_analytics.recent_sessions.map((session, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 border-white/10 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                     <div className="flex justify-between w-full items-center text-sm">
                       <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> {formatTimestamp(session.started_at)}</div>
                       <div className="flex items-center gap-2 text-muted-foreground"><Timer className="w-4 h-4" /> {formatDuration(session.duration)}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ChatDialogue dialogue={session.dialogue} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
