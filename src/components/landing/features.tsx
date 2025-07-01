import Image from 'next/image';
import { Bot, Globe, BarChart3 } from 'lucide-react';
import { AnimatedSection } from '../animated-section';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Branded AI Agents',
    description: 'Deploy 24/7 web chat and voice assistants trained on your business data to answer questions and qualify leads.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Custom Client-Facing Website',
    description: 'A professionally designed, mobile-responsive website with your branding, hosted on your custom domain.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Analytics & Optimization',
    description: 'Access a full dashboard to track quotes, calls, and agent usage, with continuous backend improvements.',
  },
];

export function Features() {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <AnimatedSection className="text-center mb-12">
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Everything Your Business Needs to Automate & Scale</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AidSync provides a comprehensive suite of tools designed to replace manual workflows and enhance client experiences.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column (Image) */}
        <div className="flex justify-center items-center w-full">
          <Image
            src="/hand.png"
            alt="A human hand and a robotic hand about to touch, symbolizing the partnership between humanity and AI."
            width={1200}
            height={800}
            className="rounded-xl w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Right Column (Content) */}
        <div className="flex flex-col gap-6">
          {features.map((feature, index) => (
            <AnimatedSection
              key={index}
              delay={100 + index * 150}
              className="bg-card/80 backdrop-blur-md border border-primary/30 text-card-foreground p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-glow-primary max-w-md"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
