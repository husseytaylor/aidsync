
import './globals.css';
import type {Metadata} from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ChatAssistant } from '@/components/chat/chat-assistant';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { createClient } from '@/lib/supabase/server';
import { ClientOnly } from '@/components/client-only';
import { Suspense } from 'react';
import AidSyncLoading from '@/components/loading-screen';


// This import triggers the environment variable validation.
import '@/config';

const siteConfig = {
  name: "AidSync AI Platform",
  description: "White-Labeled AI Automation for Growing Businesses. Custom-built websites, AI agents, and internal dashboards to replace manual quoting, onboarding, and support.",
  url: "https://aidsync.ai", // Assuming production URL for metadata
  ogImage: "/hand.png",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: "AidSync", url: siteConfig.url }],
  creator: "AidSync",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 800,
        alt: "A human and a robot hand connecting, symbolizing AI partnership.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
    creator: "@AidSync", // Placeholder Twitter handle
  },
  icons: {
    icon: "/logo.svg",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="text/javascript"
          src="https://assets.calendly.com/assets/external/widget.js"
          async
        ></script>
      </head>
      <body className="font-body antialiased text-foreground">
        {/* Background Layers: These are fixed to the viewport and sit behind all other content. */}
        <div className="fixed inset-0 -z-10 bg-[url('/green-flow-texture.png')] bg-cover bg-center bg-no-repeat" />
        <div className="fixed inset-0 -z-10 bg-[#0B3D2E]/40" />

        {/* Content Wrapper: This establishes a new stacking context so content appears above the background. */}
        <div className="relative flex flex-col min-h-screen">
          <Header user={user} />
            <Suspense fallback={<AidSyncLoading />}>
              <main className="flex-1">{children}</main>
            </Suspense>
          <Footer />
        </div>
        
        <ClientOnly>
          <ChatAssistant />
        </ClientOnly>
        <Toaster />
      </body>
    </html>
  );
}
