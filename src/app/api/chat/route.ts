
import { NextResponse } from 'next/server';
import { aiChatAssistant } from '@/ai/flows/ai-chat-assistant';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ response: 'Message is required.' }, { status: 400 });
    }

    // Directly call the Genkit flow
    const result = await aiChatAssistant({ message });
    
    // The flow returns an object with a `response` property, which is what the client expects.
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /chat] Genkit flow error:', error);
    return NextResponse.json({ response: 'An internal error occurred. Please try again later.' }, { status: 500 });
  }
}
