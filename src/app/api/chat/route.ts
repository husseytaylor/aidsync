import { NextResponse } from 'next/server';
import { AGENT_LOGGING_WEBHOOK_URL } from '@/config';

export async function POST(request: Request) {
  const webhookUrl = AGENT_LOGGING_WEBHOOK_URL;

  try {
    const body = await request.json();

    const agentResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    // If the webhook call itself fails, we pass that status along.
    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error(`[API /chat] Webhook responded with error. Status: ${agentResponse.status}. Body: ${errorText}`);
      return NextResponse.json({ response: `I'm having trouble connecting to my brain right now. Please try again later.` }, { status: agentResponse.status });
    }

    const responseData = await agentResponse.json();

    // Pass through the successful response from the webhook
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('[API /chat] Internal error:', error);
    return NextResponse.json({ response: 'An internal error occurred. Please try again later.' }, { status: 500 });
  }
}
