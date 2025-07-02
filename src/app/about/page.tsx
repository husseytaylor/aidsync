
import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Rocket, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { FounderCard } from '@/components/founder-card';
import { ClientOnly } from '@/components/client-only';
import { MotionDivider } from '@/components/motion-divider';

export default function AboutPage() {
  return (
    <div className="container py-24 sm:py-32">
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
            About AidSync
          </h1>
          <MotionDivider />
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-6 mb-12">
            We are a team of technologists and problem-solvers dedicated to empowering businesses with intelligent automation.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
        <div className="relative aspect-video max-w-5xl mx-auto mb-24">
            <Image
                src="/smart.png"
                alt="Smart automation illustration"
                fill
                className="rounded-2xl object-cover transition-all duration-700 ease-in-out hover:scale-[1.02] hover:shadow-glow-accent"
                style={{ backgroundColor: '#0c0c0c' }}
                priority
            />
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto mb-24">
        <AnimatedSection tag="div" delay={300} className="h-full">
            <Card className="flex flex-col h-full">
              <CardHeader className="items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Rocket className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                  <p className="text-muted-foreground">To replace repetitive manual tasks with seamless, AI-driven systems, freeing up human potential for more creative and strategic work.</p>
              </CardContent>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={400} className="h-full">
            <Card className="flex flex-col h-full">
               <CardHeader className="items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                  <p className="text-muted-foreground">A future where every growing business has access to enterprise-level automation, leveling the playing field and driving innovation.</p>
              </CardContent>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={500} className="h-full">
            <Card className="flex flex-col h-full">
               <CardHeader className="items-center">
                   <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Our Values</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                  <p className="text-muted-foreground">We prioritize partnership, security, and tangible results, ensuring our solutions are not just powerful, but also reliable and trustworthy.</p>
              </CardContent>
            </Card>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={600}>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-foreground">Meet the Founder</h2>
          <MotionDivider />
        </div>
        <ClientOnly>
          <FounderCard />
        </ClientOnly>
      </AnimatedSection>
    </div>
  );
}
