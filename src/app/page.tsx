import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Demo } from "@/components/landing/demo";
import { Faq } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Contact />
      <Demo />
      <Pricing />
      <Faq />
    </>
  );
}
