import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ChatAssistant } from '@/components/chat/chat-assistant';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'AidSync AI Platform',
  description: 'Intelligent Automation for Humanitarian Organizations.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground">
        {/* Background Layers: These are fixed to the viewport and sit behind all other content. */}
        <div className="fixed inset-0 -z-10 bg-[url('/green-flow-texture.png')] bg-cover bg-center bg-no-repeat" />
        <div className="fixed inset-0 -z-10 bg-[#0B3D2E]/40" />

        {/* Content Wrapper: This establishes a new stacking context so content appears above the background. */}
        <div className="relative flex flex-col min-h-screen">
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        
        <ChatAssistant />
        <Toaster />
      </body>
    </html>
  );
}
