
"use client";


import dynamic from 'next/dynamic';

const Link = dynamic(() => import('next/link'), { ssr: false });
const Image = dynamic(() => import('next/image'), { ssr: false });
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), { ssr: false });

const ArrowRight = dynamic(() => import('lucide-react').then(mod => mod.ArrowRight), { ssr: false });
const ArrowDown = dynamic(() => import('lucide-react').then(mod => mod.ArrowDown), { ssr: false });
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.section
      id="hero"
      className="pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32 scroll-mt-20 relative min-h-[600px]"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
       <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm z-0" />
      
      <div className="container relative z-10">
        <div
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              White-Labeled AI Automation for Growing Businesses
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground mb-8">
              AidSync delivers custom-built automation systems including branded websites, AI agents, and internal dashboards to replace manual quoting, onboarding, and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="#pricing">View Pricing</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link href="/contact#calendly">
                  Book a Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <motion.div
            className="relative aspect-video"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <Image
              src="/head.webp"
              alt="An abstract image of a head with circuitry, representing artificial intelligence."
              fill
              className="rounded-xl shadow-glow-accent object-cover transition-all duration-700 ease-in-out hover:scale-[1.02]"
              style={{ backgroundColor: '#0c0c0c' }}
              data-ai-hint="AI head"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </motion.div>
        </div>
      </div>


      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ArrowDown className="w-6 h-6 text-accent/80" />
      </motion.div>
    </motion.section>
  );
}
