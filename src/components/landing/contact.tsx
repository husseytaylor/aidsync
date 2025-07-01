"use client";

import { AnimatedSection } from '../animated-section';

export function Contact() {
  return (
    <section id="contact" className="container py-24 sm:py-32 scroll-mt-20 text-center">
      <AnimatedSection className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-white mb-4">
          Let’s Build Your Automation System
        </h2>
        <p className="text-lg text-muted-foreground">
          Book a free discovery call to explore how AidSync can streamline your workflows.
        </p>
      </AnimatedSection>

      <AnimatedSection
        delay={200}
        className="max-w-4xl mx-auto mt-12 rounded-3xl bg-gradient-to-br from-[#0f1f14] via-[#12372f] to-[#11271e] ring-1 ring-[#00ffd0]/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),_0_10px_20px_rgba(0,0,0,0.25)] p-4 sm:p-8"
      >
        <iframe
          src="https://calendly.com/cthussey2/new-meeting?primary_color=00ffd0"
          className="w-full h-[800px] rounded-2xl border-none bg-transparent"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </AnimatedSection>
    </section>
  );
}
