import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from '../animated-section';

export function Hero() {
  return (
    <AnimatedSection className="container pt-16 md:pt-24 lg:pt-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">
                Book a Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video rounded-xl shadow-2xl overflow-hidden">
           <Image 
            src="https://placehold.co/1200x800.png" 
            alt="AidSync Platform Screenshot" 
            fill
            className="object-cover"
            data-ai-hint="business dashboard analytics"
            priority
            />
        </div>
      </div>
    </AnimatedSection>
  );
}
