import { CalendlyEmbed } from '../calendly-embed';
import { AnimatedSection } from '../animated-section';

export function Contact() {
  return (
    <AnimatedSection id="contact" className="container py-24 sm:py-32">
      <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Ready to Automate Your Business?</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           Book a free discovery call to learn how AidSync can build a custom AI-powered system tailored to your exact needs.
         </p>
      </div>
      <div className="mt-16">
        <CalendlyEmbed />
      </div>
    </AnimatedSection>
  );
}
