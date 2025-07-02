
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.section
      id="hero"
      className="container pt-16 md:pt-24 lg:pt-32 scroll-mt-20 relative"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
       <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm z-0" />
      <div
        className="grid lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
            White-Labeled AI Automation for Growing Businesses
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground mb-8">
            AidSync delivers custom-built automation systems including branded websites, AI agents, and internal dashboards to replace manual quoting, onboarding, and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="#pricing">View Pricing</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/contact#calendly">
                Book a Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <motion.div
          className="relative aspect-video"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Image
            src="/head.png"
            alt="An abstract image of a head with circuitry, representing artificial intelligence."
            fill
            className="rounded-xl shadow-glow-accent object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
            style={{ backgroundColor: '#0c0c0c' }}
            data-ai-hint="AI head"
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
