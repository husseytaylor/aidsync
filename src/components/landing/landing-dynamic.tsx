"use client";

import dynamic from "next/dynamic";

const Features = dynamic(() => import("@/components/landing/features").then(mod => mod.Features), { ssr: false });
const Demo = dynamic(() => import("@/components/landing/demo").then(mod => mod.Demo), { ssr: false });

export function LandingDynamic() {
  return <>
    <Features />
    <Demo />
  </>;
}
