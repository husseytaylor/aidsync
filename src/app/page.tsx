
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { ClientOnly } from "@/components/client-only";
import { LandingDynamic } from "@/components/landing/landing-dynamic";
import { ScrollHandler } from "@/components/scroll-handler";

export default function Home() {
  return (
    <>
      <ScrollHandler />
      <Hero />
      <ClientOnly>
        <LandingDynamic />
        <HowItWorks />
        <Pricing />
        <Faq />
      </ClientOnly>
    </>
  );
}
