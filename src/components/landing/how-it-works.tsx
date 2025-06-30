import { AnimatedSection } from '../animated-section';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, PhoneCall, Bot, Rocket } from 'lucide-react';

const steps = [
  {
    icon: <PhoneCall className="h-8 w-8 text-primary" />,
    title: '1. Discovery & Intake',
    description: 'Book a call via our site, complete an intake form, and sign the service agreement. We learn about your goals and needs.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: '2. Content & Guidance',
    description: 'You receive detailed instructions and guidance on uploading your business documents (FAQs, processes, etc.) for AI training.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: '3. Initial Build',
    description: 'We deliver your custom-branded website and trained AI agent in approximately two weeks for you to review.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: '4. Revisions & Launch',
    description: 'After a two-week revision window for your feedback, we complete the final launch and provide your team with a user guide.',
  },
];

export function HowItWorks() {
  return (
    <AnimatedSection id="how-it-works" className="bg-secondary">
        <div className="container py-24 sm:py-32">
       <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Your Automation Journey</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           From initial call to full deployment in just a few weeks. Here’s our streamlined onboarding process.
         </p>
       </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <AnimatedSection key={index} delay={index * 150}>
            <Card className="h-full text-center border-transparent shadow-none bg-transparent">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                <CardDescription className="pt-2">{step.description}</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
    </AnimatedSection>
  );
}
