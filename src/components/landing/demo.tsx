"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function Demo() {
  const handleStartChat = () => {
    // This custom event will be picked up by the ChatAssistant component
    window.dispatchEvent(new CustomEvent('open-aidsync-chat'));
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:6624986621";
  };
  
  return (
    <motion.section
      id="demo" 
      className="container py-24 sm:py-32 scroll-mt-20"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div 
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Demo AidSync AI</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Experience our AI firsthand. Interact with our chat and phone agents to see their capabilities in real-time.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left Column (Image) */}
        <motion.div
          className="relative w-full max-w-lg mx-auto"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Image
            src="/node.png"
            alt="Abstract network node visualization representing AI connections"
            width={600}
            height={400}
            className="w-full h-auto rounded-2xl shadow-glow-accent object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
            style={{ backgroundColor: '#0c0c0c' }}
            data-ai-hint="network node"
          />
        </motion.div>

        {/* Right Column (Interactive Boxes) */}
        <div className="flex flex-col gap-8">
          {/* Chat Agent Box */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl text-foreground">Try Our Chat Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See how AidSync handles client support and quoting instantly. Engage with our AI to get your questions answered.
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleStartChat} className="w-full">Start Chat</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Phone Agent Box */}
          <div>
             <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl text-foreground">Talk to the Phone Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Call our AI assistant and hear how it handles real-time voice conversations and provides instant support.
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <Button onClick={handlePhoneCall} className="w-full">Call Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
