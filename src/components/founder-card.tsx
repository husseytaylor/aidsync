
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const bio = "Taylor is a competitive bodybuilder, pre-law scholar, and automation specialist with a drive to help others scale what matters most. With a background in logic, branding, and AI systems, he founded AidSync to blend elite performance mindset with intuitive automation. His mission is simple: empower clients to work smarter, move faster, and feel confident knowing their systems are built to grow with them.";

export function FounderCard() {
  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-2xl mx-auto">
      {/* Animated Profile Image */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/30 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <motion.div
          className="relative w-40 h-40 rounded-full shadow-2xl overflow-hidden border-4 border-foreground/10"
          animate={{ y: [0, -10, 0] }}
          whileHover={{ scale: 1.1 }}
          transition={{
            duration: 5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        >
          <Image
            src="/pp.png"
            alt="Portrait of Taylor Hussey, Founder of AidSync"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        </motion.div>
      </div>

      {/* Founder Bio Card */}
      <Card>
        <CardContent className="text-center p-6 sm:p-8">
           <h3 className="font-headline text-3xl font-bold text-foreground">Taylor Hussey</h3>
           <p className="text-accent font-semibold mt-1 text-lg">Founder & Lead AI Strategist</p>
           <p className="mt-6 text-muted-foreground leading-relaxed">
            {bio}
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
