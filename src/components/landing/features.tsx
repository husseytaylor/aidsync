import { Zap, Users, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedSection } from '../animated-section';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Logistics',
    description: 'Optimize your supply chain with predictive analytics and automated resource dispatch.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Collaborative Platform',
    description: 'Connect with partners, share real-time data, and coordinate efforts seamlessly.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Secure & Reliable',
    description: 'Built on enterprise-grade infrastructure to ensure your data is always safe and accessible.',
  },
];

export function Features() {
  return (
    <AnimatedSection id="features" className="container py-24 sm:py-32">
       <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Everything You Need to Scale Your Impact</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           AidSync provides a comprehensive suite of tools designed for the unique challenges of non-profits and humanitarian organizations.
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
