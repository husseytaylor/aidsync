"use client";

import { Hero } from "@/components/landing/hero";
import dynamic from "next/dynamic";

const HowItWorks = dynamic(() => import("@/components/landing/how-it-works").then(mod => mod.HowItWorks), { ssr: false });
const Pricing = dynamic(() => import("@/components/landing/pricing").then(mod => mod.Pricing), { ssr: false });
const Faq = dynamic(() => import("@/components/landing/faq").then(mod => mod.Faq), { ssr: false });
import { ClientOnly } from "@/components/client-only";
import { LandingDynamic } from "@/components/landing/landing-dynamic";

export function HomeClient() {
  return (
    <>
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
