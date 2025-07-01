import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Rocket, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const founder = {
  name: 'Taylor Hussey',
  role: 'Founder & Lead AI Strategist',
  avatar: '/avatars/taylor.png',
  dataAiHint: 'man portrait',
  bio: 'Taylor is a competitive bodybuilder, pre-law scholar, and automation specialist with a passion for helping businesses scale through intelligent systems. With a background in logic, branding, and AI architecture, he founded AidSync to merge high-performance mindset with world-class automation — empowering clients to work smarter, faster, and more confidently.',
};

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
            <Card className="flex flex-col h-full rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <Rocket className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2 text-white">Our Mission</h3>
                <p className="text-muted-foreground">To replace repetitive manual tasks with seamless, AI-driven systems, freeing up human potential for more creative and strategic work.</p>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={400} className="h-full">
            <Card className="flex flex-col h-full rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2 text-white">Our Vision</h3>
                <p className="text-muted-foreground">A future where every growing business has access to enterprise-level automation, leveling the playing field and driving innovation.</p>
            </Card>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={500} className="h-full">
             <Card className="flex flex-col h-full rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                 <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                    <ShieldCheck className="w-8 h-8 text-[#00ffd0]" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2 text-white">Our Values</h3>
                <p className="text-muted-foreground">We prioritize partnership, security, and tangible results, ensuring our solutions are not just powerful, but also reliable and trustworthy.</p>
            </Card>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={600}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold mb-12">Meet the Founder</h2>
        </div>
        <div className="max-w-2xl mx-auto">
             <Card className="flex flex-col items-center text-center rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-8">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full border-2 border-white/10 shadow-inner overflow-hidden">
                    <Image
                        src="https://placehold.co/128x128.png"
                        alt={`Portrait of ${founder.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint={founder.dataAiHint}
                        unoptimized
                    />
                </div>
                <CardTitle className="font-headline text-2xl text-white">{founder.name}</CardTitle>
                <p className="text-accent mt-1 mb-4">{founder.role}</p>
                <CardContent className="p-0">
                    <p className="text-muted-foreground text-base whitespace-pre-line">
                        {founder.bio}
                    </p>
                </CardContent>
            </Card>
        </div>
      </AnimatedSection>
    </div>
  );
}
