
"use client";

import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail, HelpCircle, Clock, CheckSquare } from 'lucide-react';
import { ClientOnly } from '@/components/client-only';
import { MotionDivider } from '@/components/motion-divider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const callFaqs = [
  {
    icon: <HelpCircle className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "What will we cover?",
    answer: "We'll discuss your business goals, current workflows, and identify key areas where AI automation can deliver the most impact. We'll also demo relevant features of the AidSync platform."
  },
  {
    icon: <Clock className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "How long is the call?",
    answer: "Discovery calls are scheduled for 45 minutes. We aim to be respectful of your time while ensuring we have enough detail to propose a valuable solution."
  },
  {
    icon: <CheckSquare className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "Do I need to prepare anything?",
    answer: "No preparation is needed! After you book, you will be sent a discovery call intake form. Providing these details before our call allows us to have the most productive conversation possible. If you have specific documents or processes you'd like to discuss, feel free to have them handy."
  }
];

export default function ContactPage() {
  const handleStartChat = () => {
    // This check is necessary because this could be rendered on the server
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-aidsync-chat'));
    }
  };

  return (
    <div className="container py-24 sm:py-32">
        <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4">
                    Contact AidSync
                </h1>
                <MotionDivider />
                <p className="max-w-xl mx-auto text-lg text-muted-foreground mt-8 mb-12">
                    Choose the most convenient way to reach us. We&apos;re here to help.
                </p>
            </div>
        </AnimatedSection>
        
        <ClientOnly>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
              <AnimatedSection tag="div" delay={100} className="h-full">
                   <Card className="h-full flex flex-col text-center">
                      <CardHeader className="items-center">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                              <MessageSquare className="w-6 h-6 text-accent" />
                          </div>
                          <CardTitle className="font-headline text-2xl font-bold text-foreground">Chat with AI</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="text-muted-foreground">Get answers from our AI assistant, available 24/7 for your questions.</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                          <Button onClick={handleStartChat} className="w-full">Start Chat</Button>
                      </div>
                  </Card>
              </AnimatedSection>
              <AnimatedSection tag="div" delay={200} className="h-full">
                  <Card className="h-full flex flex-col text-center">
                      <CardHeader className="items-center">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                              <Phone className="w-6 h-6 text-accent" />
                          </div>
                          <CardTitle className="font-headline text-2xl font-bold text-foreground">Call Voice Agent</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="text-muted-foreground">Speak with our 24/7 AI voice agent for immediate, hands-free support.</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                          <Button asChild className="w-full"><a href="tel:6624986621">Call Now</a></Button>
                      </div>
                  </Card>
              </AnimatedSection>
              <AnimatedSection tag="div" delay={300} className="h-full">
                   <Card className="h-full flex flex-col text-center">
                      <CardHeader className="items-center">
                           <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                              <Mail className="w-6 h-6 text-accent" />
                          </div>
                          <CardTitle className="font-headline text-2xl font-bold text-foreground">Email Support</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="text-muted-foreground">Send us an email for formal inquiries or detailed account-specific issues.</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                           <Button asChild className="w-full"><a href="mailto:support@aidsyncai.com">Email Us</a></Button>
                      </div>
                  </Card>
              </AnimatedSection>
          </div>
        </ClientOnly>

        <ClientOnly>
          <AnimatedSection delay={400} id="calendly" className="scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-foreground mb-4">
                    Book Your Free Strategy Call
                  </h2>
                   <MotionDivider />
                  <p className="text-lg text-muted-foreground mt-8">
                    Explore how AidSync can streamline your operations and unlock new growth opportunities.
                  </p>
              </div>

              <Card className="max-w-4xl mx-auto mt-12 p-2 sm:p-4">
                  <iframe
                    src="https://calendly.com/cthussey2/new-meeting?primary_color=48D1CC"
                    className="w-full h-[800px] rounded-2xl border-none bg-transparent"
                    frameBorder="0"
                    scrolling="no"
                    title="Calendly scheduling form"
                    width="100%"
                    height="800"
                    style={{ aspectRatio: '1/1', minHeight: 400 }}
                  ></iframe>
              </Card>

              <div className="max-w-3xl mx-auto mt-16">
                <Card className="p-6 sm:p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h3 className="font-headline text-2xl font-bold text-foreground">
                      About Your Discovery Call
                    </h3>
                    <MotionDivider />
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {callFaqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                      >
                        <AccordionTrigger>
                          <div className="flex items-center gap-4 text-left">
                            {faq.icon}
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </div>
          </AnimatedSection>
        </ClientOnly>
    </div>
  );
}
