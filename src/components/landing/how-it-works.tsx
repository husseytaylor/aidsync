"use client";

import { motion } from 'framer-motion';
import { FileText, PhoneCall, Rocket, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MotionDivider } from '../motion-divider';

const steps = [
  {
    icon: <PhoneCall className="h-8 w-8 text-accent" />,
    title: '1. Discovery & Intake',
    description: 'Book a call via our site, complete an intake form, and sign the service agreement. We learn about your goals and needs.',
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: '2. Content & Guidance',
    description: 'You receive detailed instructions on uploading your business documents (FAQs, processes, etc.) for AI training.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-accent" />,
    title: '3. Build & Deploy',
    description: 'We deliver your custom-branded website and trained AI agent in approximately two weeks for you to review.',
  },
  {
    icon: <ClipboardCheck className="h-8 w-8 text-accent" />,
    title: '4. Revisions & Launch',
    description: 'After a two-week revision window for your feedback, we complete the final launch and provide a user guide.',
  },
];

export function HowItWorks() {
  return (
    <motion.section 
      id="how-it-works"
      className="container py-24 sm:py-32 scroll-mt-20 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Your Automation Journey</h2>
        <MotionDivider />
        <p className="mt-4 text-lg text-muted-foreground">
          From initial call to full deployment in just a few weeks. Here’s our streamlined onboarding process.
        </p>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card className="h-full text-center">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 ring-8 ring-accent/5">
                  {step.icon}
                </div>
                <h3 className="font-headline text-xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm flex-grow">{step.description}</p>
              </CardContent>
            </Card>

            {/* Timeline Connector */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-14 left-full w-10 h-px -translate-y-1/2 bg-gradient-to-r from-accent/50 via-accent/25 to-transparent" aria-hidden="true" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="absolute -bottom-16 left-0 w-full h-32" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 128" fill="none" preserveAspectRatio="none">
            <path d="M0 120C480 0 960 0 1440 120" stroke="url(#how-it-works-divider-gradient)" strokeWidth="2" />
            <defs>
                <linearGradient id="how-it-works-divider-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#48D1CC" stopOpacity="0"/>
                    <stop offset="0.5" stopColor="#48D1CC"/>
                    <stop offset="1" stopColor="#48D1CC" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
      </div>
    </motion.section>
  );
}
