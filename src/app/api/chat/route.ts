
import { NextResponse } from 'next/server';

const N8N_RESPONSE_WEBHOOK_URL = 'https://bridgeboost.app.n8n.cloud/webhook/51cb5fe7-c357-4517-ba28-b0609ec75fcf';
const ORG_ID = '8dee815e-5e29-47cb-a171-8f522fee0eea';

export async function POST(request: Request) {
  try {
    // 1. Parse and validate the incoming request body
    const body = await request.json();
    const { message, session_id } = body;

    if (!message || !session_id) {
      return NextResponse.json(
        { response: 'Bad Request: `message` and `session_id` are required.' },
        { status: 400 }
      );
    }

    // 2. Construct the payload for the external webhook
    const domain = request.headers.get('origin') || request.headers.get('host') || 'unknown';
    const payload = {
      message,
      session_id,
      org_id: ORG_ID,
      domain,
      timestamp: new Date().toISOString(),
    };

    // 3. POST the payload to the external n8n webhook
    const n8nResponse = await fetch(N8N_RESPONSE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`[API /chat] n8n webhook failed with status: ${n8nResponse.status}`, errorText);
      throw new Error(`External webhook failed with status: ${n8nResponse.status}`);
    }

    // 4. Parse the response from the webhook
    const n8nData = await n8nResponse.json();

    // 5. Extract the bot's reply, handling both array and object formats
    const botReply = Array.isArray(n8nData) ? n8nData[0]?.output : n8nData.output;

    if (!botReply) {
      console.error('[API /chat] Invalid or empty `output` from n8n webhook:', n8nData);
      throw new Error('AI assistant returned an empty or invalid response from webhook.');
    }

    // 6. Return the formatted response to the client
    return NextResponse.json({ response: botReply });

  } catch (error) {
    if (error instanceof Error) {
      console.error('[API /chat] An unexpected error occurred:', error.message);
    } else {
      console.error('[API /chat] Unknown error occurred:', error);
    }
    return NextResponse.json(
      { response: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
