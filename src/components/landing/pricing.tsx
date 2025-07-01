"use client";

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';

const tiers = [
  {
    name: 'Starter',
    setupFee: '$2,500',
    monthlyFee: '$950',
    description: 'For businesses needing a professional web presence and basic lead capture.',
    features: [
      'Branded client-facing website',
      'Custom domain + hosting',
      'Basic contact form',
      'Mobile-responsive design',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    setupFee: '$4,500',
    monthlyFee: '$1,500',
    description: 'Automate interactions with AI-powered chat and voice agents.',
    features: [
      'Everything in Starter, plus:',
      'AI chat widget (web-only)',
      '24/7 voice agent (6,000 mins/mo)',
      'Custom assistant persona',
      'Email + 2 live support calls/mo',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Command Suite',
    setupFee: '$7,000',
    monthlyFee: '$2,500',
    description: 'For businesses ready to scale with advanced analytics and backend automation.',
    features: [
      'Everything in Growth, plus:',
      'Internal assistant for your team',
      'Full analytics dashboard',
      'Backend optimization',
      'Priority email, live chat & voice',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Custom AI',
    setupFee: 'Upon Request',
    monthlyFee: 'Custom',
    description: 'Fully-scoped, custom AI systems and workflows built to your specifications.',
    features: [
      'Everything in Command Suite, plus:',
      'AI-Driven Sales Pipelines',
      'Inventory & Supply Chain AI',
      'Automated Bid Generation',
      'Dedicated support channel',
    ],
    cta: 'Book a Call',
  },
];

export function Pricing() {
  return (
    <motion.section 
      id="pricing" 
      className="container py-24 sm:py-32 scroll-mt-20"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
       <div 
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Pricing Plans</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the right tier for your business. All plans include hosting, updates, and dashboard access.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="h-full"
          >
            <Card className="flex flex-col h-full transition-all duration-300 border-accent/30 hover:shadow-glow-accent hover:-translate-y-2">
              <CardHeader className="p-6 lg:p-8">
                <CardTitle 
                  className="font-headline font-bold text-[22px] text-accent transition-colors duration-300 hover:text-accent/90"
                  style={{ textShadow: "0 0 8px hsl(var(--accent) / 0.8)" }}
                >
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-sm min-h-[40px] pt-2">{tier.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-4xl font-extrabold font-headline text-accent transition-colors duration-300 hover:text-accent/90"
                      style={{ textShadow: "0 0 8px hsl(var(--accent) / 0.8)" }}
                    >
                      {tier.setupFee}
                    </span>
                    {tier.setupFee !== 'Upon Request' && <span className="text-muted-foreground">Setup</span>}
                  </div>
                  {tier.monthlyFee !== 'Custom' && (
                     <div className="flex items-baseline gap-1 mt-1">
                      <p className="text-xl font-semibold">{tier.monthlyFee}</p>
                      <span className="text-sm font-normal text-muted-foreground">/ month</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 lg:p-8 pt-0">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 lg:p-8 pt-0">
                 <Button asChild className="w-full">
                    <Link href="#contact">{tier.cta}</Link>
                 </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
