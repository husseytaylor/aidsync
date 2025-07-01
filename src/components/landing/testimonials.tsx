"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export function Testimonials() {
  const handleStartChat = () => {
    // This custom event will be picked up by the ChatAssistant component
    window.dispatchEvent(new CustomEvent('open-aidsync-chat'));
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:6624986621";
  };
  
  return (
    <section id="demo" className="container py-24 sm:py-32">
      <motion.div 
        className="max-w-2xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Demo AidSync AI</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Experience our AI firsthand. Interact with our chat and phone agents to see their capabilities in real-time.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Left Column (Image) */}
        <motion.div variants={imageVariants} className="relative w-full max-w-lg mx-auto">
          <Image
            src="/node.png"
            alt="Abstract network node visualization representing AI connections"
            width={600}
            height={400}
            className="w-full h-auto object-contain rounded-xl shadow-2xl"
            data-ai-hint="network node"
          />
        </motion.div>

        {/* Right Column (Interactive Boxes) */}
        <div className="flex flex-col gap-8">
          {/* Chat Agent Box */}
          <motion.div variants={cardVariants}>
            <Card className="h-full transition-all duration-300 border-accent/30 hover:shadow-glow-accent hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Try Our Chat Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See how AidSync handles client support and quoting instantly. Engage with our AI to get your questions answered.
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleStartChat} className="w-full" variant="outline">Start Chat</Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Phone Agent Box */}
          <motion.div variants={cardVariants}>
             <Card className="h-full transition-all duration-300 border-accent/30 hover:shadow-glow-accent hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Talk to the Phone Agent</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Call our AI assistant and hear how it handles real-time voice conversations and provides instant support.
                </CardDescription>
              </CardContent>
              <CardFooter>
                 <Button onClick={handlePhoneCall} className="w-full" variant="outline">Call Now</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
