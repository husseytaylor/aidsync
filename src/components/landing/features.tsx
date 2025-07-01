"use client";

import Image from 'next/image';
import { Bot, Globe, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-accent" />,
    title: 'Branded AI Agents',
    description: 'Deploy 24/7 web chat and voice assistants trained on your business data to answer questions and qualify leads.',
  },
  {
    icon: <Globe className="h-8 w-8 text-accent" />,
    title: 'Custom Client-Facing Website',
    description: 'A professionally designed, mobile-responsive website with your branding, hosted on your custom domain.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: 'Analytics & Optimization',
    description: 'Access a full dashboard to track quotes, calls, and agent usage, with continuous backend improvements.',
  },
];

export function Features() {
  return (
    <motion.section
      id="features" 
      className="container py-24 sm:py-32 scroll-mt-20"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Everything Your Business Needs to Automate & Scale</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AidSync provides a comprehensive suite of tools designed to replace manual workflows and enhance client experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column (Image) */}
        <motion.div
          className="relative w-full max-w-lg mx-auto"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Image
            src="/hand.png"
            alt="A human hand and a robotic hand about to touch, symbolizing the partnership between humanity and AI."
            width={1200}
            height={800}
            className="w-full h-auto rounded-2xl shadow-glow-accent object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
            style={{ backgroundColor: '#0c0c0c' }}
            data-ai-hint="human AI partnership"
            priority
            unoptimized
          />
        </motion.div>

        {/* Right Column (Content) */}
        <div className="flex flex-col gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 sm:p-6 bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-glow-accent max-w-md"
            >
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
