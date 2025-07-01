// This file is no longer in use.
// The n8n analytics functionality has been removed as per user request
// to rely solely on the agent analytics webhook for dashboard data.
export async function GET() {
  return new Response(JSON.stringify({ message: "This endpoint is deprecated." }), {
    status: 410, // Gone
    headers: { 'Content-Type': 'application/json' },
  });
}
