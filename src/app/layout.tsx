import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ChatAssistant } from '@/components/chat/chat-assistant';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'AidSync AI Platform',
  description: 'Intelligent Automation for Humanitarian Organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground">
        <div 
          className="fixed inset-0 bg-cover bg-center -z-10" 
          style={{ backgroundImage: "url('/green-flow-texture.png')" }}
        />
        <div className="fixed inset-0 bg-[#1E5028]/40 backdrop-blur-sm -z-10" />

        <div className="relative z-0 flex flex-col min-h-screen bg-transparent">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ChatAssistant />
        <Toaster />
      </body>
    </html>
  );
}
