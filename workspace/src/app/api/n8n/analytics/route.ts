// This file is no longer in use and is a duplicate.
// The primary analytics functionality is handled by the agent webhook.
export async function GET() {
  return new Response(JSON.stringify({ message: "This endpoint is deprecated." }), {
    status: 410, // Gone
    headers: { 'Content-Type': 'application/json' },
  });
}
