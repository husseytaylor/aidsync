import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Rocket, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { FounderCard } from '@/components/founder-card';
import { ClientOnly } from '@/components/client-only';

export default function AboutPage() {
  return (
    <div className="container py-24 sm:py-32">
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
            About AidSync
          </h1>
          <div className="w-24 h-1 bg-accent/80 mt-3 mx-auto rounded-full animate-pulse"></div>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-8 mb-12">
            We are a team of technologists and problem-solvers dedicated to empowering businesses with intelligent automation.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
        <div className="relative aspect-video max-w-5xl mx-auto mb-24">
            <Image
                src="https://placehold.co/1200x600.png"
                alt="AidSync team working collaboratively in a modern office"
                fill
                className="rounded-2xl shadow-[0_0_20px_3px_rgba(0,255,150,0.25)] object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
                style={{ backgroundColor: '#0c0c0c' }}
                data-ai-hint="team collaboration"
                unoptimized
            />
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto mb-24">
        <AnimatedSection tag="div" delay={300} className="h-full">
            <Card className="flex flex-col h-full rounded-2xl bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <Rocket className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-white">Our Mission</h3>
                <p className="text-muted-foreground">To replace repetitive manual tasks with seamless, AI-driven systems, freeing up human potential for more creative and strategic work.</p>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={400} className="h-full">
            <Card className="flex flex-col h-full rounded-2xl bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-muted-foreground">A future where every growing business has access to enterprise-level automation, leveling the playing field and driving innovation.</p>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={500} className="h-full">
             <Card className="flex flex-col h-full rounded-2xl bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                 <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <ShieldCheck className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-white">Our Values</h3>
                <p className="text-muted-foreground">We prioritize partnership, security, and tangible results, ensuring our solutions are not just powerful, but also reliable and trustworthy.</p>
            </Card>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={600}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white">Meet the Founder</h2>
        </div>
        <ClientOnly>
          <FounderCard />
        </ClientOnly>
      </AnimatedSection>
    </div>
  );
}
