"use client";

import { AnimatedSection } from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail } from 'lucide-react';

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
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
                    Contact AidSync
                </h1>
                <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-12">
                    Choose the most convenient way to reach us. We're here to help.
                </p>
            </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
            <AnimatedSection tag="div" delay={100} className="h-full">
                 <Card className="h-full flex flex-col rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)]">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-2">
                            <MessageSquare className="w-6 h-6 text-[#00ffd0]" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-white">Chat with AI</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">Get instant answers to your questions by chatting with our AI assistant, available 24/7.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button onClick={handleStartChat} className="w-full">Start Chat</Button>
                    </div>
                </Card>
            </AnimatedSection>
            <AnimatedSection tag="div" delay={200} className="h-full">
                <Card className="h-full flex flex-col rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)]">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-2">
                            <Phone className="w-6 h-6 text-[#00ffd0]" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-white">Call Voice Agent</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">Speak with our 24/7 AI-powered voice agent for immediate phone support.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full"><a href="tel:6624986621">Call Now</a></Button>
                    </div>
                </Card>
            </AnimatedSection>
            <AnimatedSection tag="div" delay={300} className="h-full">
                 <Card className="h-full flex flex-col rounded-2xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)]">
                    <CardHeader>
                         <div className="w-12 h-12 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-2">
                            <Mail className="w-6 h-6 text-[#00ffd0]" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-white">Email Support</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">For formal inquiries or account-specific issues, please send us an email.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                         <Button asChild className="w-full"><a href="mailto:support@aidsyncai.com">Email Us</a></Button>
                    </div>
                </Card>
            </AnimatedSection>
        </div>

        <AnimatedSection delay={400} id="calendly">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-white mb-4">
                  Schedule a Discovery Call
                </h2>
                <p className="text-lg text-muted-foreground">
                  Ready to build? Book a free discovery call to explore how AidSync can streamline your workflows.
                </p>
            </div>

            <div
                className="max-w-4xl mx-auto mt-12 rounded-3xl bg-gradient-to-br from-[#1d3226] to-[#052a1a]/70 backdrop-blur-md border border-white/10 shadow-xl p-4 sm:p-8"
            >
                <iframe
                src="https://calendly.com/cthussey2/new-meeting?primary_color=00ffd0"
                className="w-full h-[800px] rounded-2xl border-none bg-transparent"
                frameBorder="0"
                scrolling="no"
                ></iframe>
            </div>
        </AnimatedSection>
    </div>
  );
}
