import { AnimatedSection } from '../animated-section';

export function Contact() {
  return (
    <AnimatedSection id="contact" tag="section" className="container py-24 sm:py-32 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Ready to Automate Your Business?</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           Book a free discovery call to learn how AidSync can build a custom AI-powered system tailored to your exact needs.
         </p>
      </div>
      <div className="mt-16">
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-glow-primary backdrop-blur-md bg-card/90 border border-primary/20 p-6">
          <div
            className="calendly-inline-widget min-h-[700px] w-full"
            data-url="https://calendly.com/cthussey2/new-meeting"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </div>
    </AnimatedSection>
  );
}
