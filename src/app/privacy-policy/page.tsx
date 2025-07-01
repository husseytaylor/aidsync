import { AnimatedSection } from '@/components/animated-section';
import { Card } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-24 sm:py-32">
      <AnimatedSection>
        <Card className="max-w-3xl mx-auto rounded-2xl bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl p-6 sm:p-8 md:p-12">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-12 text-center">
            Privacy Policy
          </h1>
          <div className="prose prose-invert lg:prose-xl text-muted-foreground space-y-6 mx-auto">
            <p>Effective Date: June 6, 2025</p>

            <p>
              AidSync ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
            </p>

            <h2 className="font-headline text-2xl text-white">1. Information We Collect</h2>
            <p>
              We may collect basic information when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Fill out a form (e.g., to schedule a discovery call)</li>
                <li>Contact us directly</li>
                <li>Use features on our site</li>
            </ul>
            <p>
              This may include your name, email address, and any information you choose to provide.
            </p>
            <p>
              We may also automatically collect non-personal information, such as your browser type, IP address, device, and pages visited.
            </p>

            <h2 className="font-headline text-2xl text-white">2. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Respond to inquiries</li>
                <li>Provide and improve our services</li>
                <li>Schedule meetings or calls when requested</li>
            </ul>
            <p>
              We do not sell or share your personal information with third parties for marketing purposes.
            </p>

            <h2 className="font-headline text-2xl text-white">3. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings if you prefer.
            </p>
            
            <h2 className="font-headline text-2xl text-white">4. Data Security</h2>
            <p>
              We take reasonable steps to protect your information but cannot guarantee absolute security.
            </p>
            
            <h2 className="font-headline text-2xl text-white">5. Third-Party Links</h2>
            <p>
              Our website may contain links to other sites. We are not responsible for their content or privacy practices.
            </p>

             <h2 className="font-headline text-2xl text-white">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.
            </p>
            
            <h2 className="font-headline text-2xl text-white">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, you can contact us at: <a href="mailto:support@aidsyncai.com" className="text-accent hover:underline">support@aidsyncai.com</a>.
            </p>

          </div>
        </Card>
      </AnimatedSection>
    </div>
  );
}
