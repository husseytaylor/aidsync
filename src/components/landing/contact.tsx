import { AnimatedSection } from '../animated-section';

export function Contact() {
  return (
    <section id="contact" className="container py-24 sm:py-32 scroll-mt-20">
      <AnimatedSection className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold">
          Let’s Build Your Automation System
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Book a free discovery call to explore how AidSync can streamline your workflows.
        </p>
      </AnimatedSection>

      <AnimatedSection
        className="rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg overflow-hidden p-4"
        delay={300}
      >
        <iframe
          src="https://calendly.com/cthussey2/new-meeting?primary_color=00A693"
          width="100%"
          height="100%"
          className="rounded-xl border-none"
          style={{ minHeight: '800px' }}
          frameBorder="0"
          scrolling="no"
        />
      </AnimatedSection>
    </section>
  );
}
