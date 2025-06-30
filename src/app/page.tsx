import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Contact } from "@/components/landing/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <Contact />
    </>
  );
}
