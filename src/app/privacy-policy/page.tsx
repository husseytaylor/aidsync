import { AnimatedSection } from '@/components/animated-section';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-24 sm:py-32">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-12">
            Privacy Policy
          </h1>
          <div className="prose prose-invert lg:prose-xl text-muted-foreground space-y-6">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>

            <h2 className="font-headline text-2xl text-white">1. Introduction</h2>
            <p>
              Welcome to AidSync AI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="font-headline text-2xl text-white">2. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use.
            </p>

            <h2 className="font-headline text-2xl text-white">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>To facilitate account creation and logon process.</li>
                <li>To send administrative information to you.</li>
                <li>To protect our Services.</li>
                <li>To enforce our terms, conditions, and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
            </ul>

            <h2 className="font-headline text-2xl text-white">4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            
            <h2 className="font-headline text-2xl text-white">5. How We Keep Your Information Safe</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>

             <h2 className="font-headline text-2xl text-white">6. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at support@aidsyncai.com.
            </p>

          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
