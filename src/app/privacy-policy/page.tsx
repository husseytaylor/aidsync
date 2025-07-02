import { AnimatedSection } from '@/components/animated-section';
import { MotionDivider } from '@/components/motion-divider';
import { Card } from '@/components/ui/card';
import { ClientOnly } from '@/components/client-only';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-24 sm:py-32">
      <ClientOnly>
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Card className="p-6 sm:p-8 md:p-12 backdrop-blur-xl border-accent/30">
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4 text-center">
                Privacy Policy
              </h1>
              <MotionDivider />
              <div className="prose prose-lg prose-invert max-w-none mt-8 text-muted-foreground 
                            prose-headings:font-headline prose-headings:text-foreground 
                            prose-a:text-accent prose-a:transition-colors prose-a:hover:text-primary">
                <p className="text-center text-sm">Effective Date: June 6, 2025</p>

                <p>
                  AidSync ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                  We may collect basic information when you:
                </p>
                <ul>
                    <li>Fill out a form (e.g., to schedule a discovery call)</li>
                    <li>Contact us directly</li>
                    <li>Use features on our site</li>
                </ul>
                <p>
                  This may also include your name, email address, and any information you choose to provide. We may also automatically collect non-personal information, such as your browser type, IP address, device, and pages visited.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                  We use your information to:
                </p>
                <ul>
                    <li>Respond to inquiries</li>
                    <li>Provide and improve our services</li>
                    <li>Schedule meetings or calls when requested</li>
                </ul>
                <p>
                  We do not sell or share your personal information with third parties for marketing purposes.
                </p>

                <h2>3. Cookies</h2>
                <p>
                  Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings if you prefer.
                </p>
                
                <h2>4. Data Security</h2>
                <p>
                  We take reasonable steps to protect your information but cannot guarantee absolute security.
                </p>
                
                <h2>5. Third-Party Links</h2>
                <p>
                  Our website may contain links to other sites. We are not responsible for their content or privacy practices.
                </p>

                <h2>6. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.
                </p>
                
                <h2>7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, you can contact us at: <a href="mailto:support@aidsyncai.com">support@aidsyncai.com</a>.
                </p>

              </div>
            </Card>
          </div>
        </AnimatedSection>
      </ClientOnly>
    </div>
  );
}
