import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedSection } from '../animated-section';
import Link from 'next/link';

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
    <AnimatedSection id="pricing" tag="section" className="container py-24 sm:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Pricing Plans</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the right tier for your business. All plans include hosting, updates, and dashboard access.
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier, index) => (
          <AnimatedSection key={index} delay={index * 150}>
            <Card className={`flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="font-headline">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold font-headline">{tier.setupFee}</span>
                  <span className="text-muted-foreground"> Setup</span>
                  {tier.monthlyFee !== 'Custom' && (
                     <p className="text-xl font-semibold mt-1">{tier.monthlyFee} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                    <Link href="#contact">{tier.cta}</Link>
                 </Button>
              </CardFooter>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
}
