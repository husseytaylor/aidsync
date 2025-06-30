import { Bot, Globe, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <AnimatedSection id="features" className="container py-24 sm:py-32">
       <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Everything Your Business Needs to Automate & Scale</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           AidSync provides a comprehensive suite of tools designed to replace manual workflows and enhance client experiences.
         </p>
       </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <AnimatedSection key={index} delay={index * 150}>
            <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
}
