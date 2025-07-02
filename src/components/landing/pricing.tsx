
"use client";

import { Check, Network, Settings, BrainCircuit, LifeBuoy, Globe, Server, Mail, Smartphone, MessageSquare, Phone, Bot, Users, BarChart3, ShieldCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MotionDivider } from '../motion-divider';

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
    isFeatured: true,
    features: [
      'Everything in Starter, plus:',
      'AI chat widget (web-only)',
      '24/7 voice agent (6,000 mins/mo)',
      'Custom assistant persona',
      'Email + 2 live support calls/mo',
    ],
    cta: 'Get Started',
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

const featureIcons: { [key: string]: React.ElementType } = {
  'Branded client-facing website': Globe,
  'Custom domain + hosting': Server,
  'Basic contact form': Mail,
  'Mobile-responsive design': Smartphone,
  'Email support': LifeBuoy,
  'AI chat widget (web-only)': MessageSquare,
  '24/7 voice agent (6,000 mins/mo)': Phone,
  'Custom assistant persona': Bot,
  'Email + 2 live support calls/mo': ShieldCheck,
  'Internal assistant for your team': Users,
  'Full analytics dashboard': BarChart3,
  'Backend optimization': Settings,
  'Priority email, live chat & voice': ShieldCheck,
  'AI-Driven Sales Pipelines': Network,
  'Inventory & Supply Chain AI': BrainCircuit,
  'Automated Bid Generation': Settings,
  'Dedicated support channel': LifeBuoy,
};


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
        <MotionDivider />
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the right tier for your business. All plans include hosting, updates, and dashboard access.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={index}
            className="h-full relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {tier.isFeatured && (
               <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 transform bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full shadow-lg">
                 Best Value
               </div>
            )}
            <Card className="flex flex-col h-full">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle 
                  className="font-headline font-bold text-[22px] text-foreground"
                >
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-sm min-h-[40px] pt-2">{tier.description}</CardDescription>
                <div className="pt-4 min-h-[100px]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-headline text-foreground">
                      {tier.setupFee}
                    </span>
                    {tier.setupFee !== 'Upon Request' && <span className="text-muted-foreground/80">Setup</span>}
                  </div>
                  {tier.monthlyFee !== 'Custom' && (
                     <div className="flex items-baseline gap-1 mt-1">
                      <p className="text-2xl font-semibold text-foreground">{tier.monthlyFee}</p>
                      <span className="text-sm font-normal text-muted-foreground/80">/ month</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 sm:p-6 pt-0">
                <ul className="space-y-4">
                  {tier.features.map((feature) => {
                    if (feature.startsWith('Everything in')) {
                      return (
                        <li key={feature} className="flex items-start gap-3 pt-2">
                          <Plus className="w-5 h-5 text-primary/70 mt-1 flex-shrink-0" />
                          <span className="text-sm font-semibold text-muted-foreground">{feature}</span>
                        </li>
                      )
                    }
                    const IconComponent = featureIcons[feature] || Check;
                    return (
                      <li key={feature} className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 pt-0 mt-auto">
                 <Button
                    asChild
                    className="w-full"
                  >
                    <Link href="/contact#calendly">{tier.cta}</Link>
                  </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
