"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="container pt-16 md:pt-24 lg:pt-32">
      <motion.div
        className="grid lg:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1 variants={itemVariants} className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
            White-Labeled AI Automation for Growing Businesses
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-xl text-lg text-muted-foreground mb-8">
            AidSync delivers custom-built automation systems including branded websites, AI agents, and internal dashboards to replace manual quoting, onboarding, and support.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="#pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">
                Book a Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div variants={imageVariants} className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
          <Image
            src="/hero-image.png"
            alt="A digital, grid-like hand connecting with a human hand, symbolizing the partnership between AI and humanity."
            fill
            className="object-cover"
            data-ai-hint="AI connection"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
