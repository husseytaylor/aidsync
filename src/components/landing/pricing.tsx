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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export function Pricing() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
       <motion.div 
        className="max-w-2xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Pricing Plans</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the right tier for your business. All plans include hosting, updates, and dashboard access.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="h-full"
          >
            <Card className="flex flex-col h-full transition-all duration-300 border-primary/30 hover:shadow-glow-primary hover:-translate-y-2">
              <CardHeader className="p-6 lg:p-8">
                <CardTitle 
                  className="font-headline font-bold text-[22px] text-[#00E6C2] transition-colors duration-300 hover:text-[#00FFD0]"
                  style={{ textShadow: "0 0 8px #00E6C280" }}
                >
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-sm min-h-[40px] pt-2">{tier.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-4xl font-extrabold font-headline text-[#00E6C2] transition-colors duration-300 hover:text-[#00FFD0]"
                      style={{ textShadow: "0 0 8px #00E6C280" }}
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
                 <Button asChild className="w-full" variant="default">
                    <Link href="#contact">{tier.cta}</Link>
                 </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
