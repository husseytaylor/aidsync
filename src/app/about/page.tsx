import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Rocket, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Corey Hussey',
    role: 'Founder & Lead AI Strategist',
    avatar: '/avatars/corey.png',
    dataAiHint: 'man portrait',
  },
  {
    name: 'Jane Doe',
    role: 'Head of Engineering',
    avatar: '/avatars/jane.png',
    dataAiHint: 'woman portrait',
  },
  {
    name: 'John Smith',
    role: 'Senior Product Designer',
    avatar: '/avatars/john.png',
    dataAiHint: 'man portrait',
  },
];

export default function AboutPage() {
  return (
    <div className="container py-24 sm:py-32">
      <AnimatedSection>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
            About AidSync
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-12">
            We are a team of technologists and problem-solvers dedicated to empowering businesses with intelligent automation.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <div className="relative aspect-video max-w-5xl mx-auto mb-24">
            <Image
                src="https://placehold.co/1200x600.png"
                alt="AidSync team working collaboratively in a modern office"
                fill
                className="rounded-xl shadow-[0_0_20px_3px_rgba(0,255,150,0.25)] object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
                style={{ backgroundColor: '#0c0c0c' }}
                data-ai-hint="team collaboration"
                unoptimized
            />
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto mb-24">
        <AnimatedSection tag="div" delay={300} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-[#00ffd0]" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">To replace repetitive manual tasks with seamless, AI-driven systems, freeing up human potential for more creative and strategic work.</p>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={400} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#00ffd0]" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">A future where every growing business has access to enterprise-level automation, leveling the playing field and driving innovation.</p>
        </AnimatedSection>
        <AnimatedSection tag="div" delay={500} className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-[#00ffd0]" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2">Our Values</h3>
            <p className="text-muted-foreground">We prioritize partnership, security, and tangible results, ensuring our solutions are not just powerful, but also reliable and trustworthy.</p>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={600}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold mb-12">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
             <div key={index} className="h-full">
                <Card className="flex flex-col h-full rounded-2xl bg-gradient-to-br from-[#0f1f14] via-[#12372f] to-[#11271e] ring-1 ring-[#00ffd0]/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),_0_10px_20px_rgba(0,0,0,0.25)] transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] text-center p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                            src="https://placehold.co/96x96.png"
                            alt={`Portrait of ${member.name}`}
                            fill
                            className="rounded-full object-cover"
                            data-ai-hint={member.dataAiHint}
                            unoptimized
                        />
                    </div>
                    <CardTitle className="font-headline text-xl text-white">{member.name}</CardTitle>
                    <CardContent className="p-0 pt-1">
                        <p className="text-accent">{member.role}</p>
                    </CardContent>
                </Card>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
