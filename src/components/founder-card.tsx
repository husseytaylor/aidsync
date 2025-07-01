"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

const bio = "Taylor is a competitive bodybuilder, pre-law scholar, and automation specialist with a drive to help others scale what matters most. With a background in logic, branding, and AI systems, he founded AidSync to blend elite performance mindset with intuitive automation. His mission is simple: empower clients to work smarter, move faster, and feel confident knowing their systems are built to grow with them.";
const mission = "To replace repetitive manual tasks with seamless, AI-driven systems, freeing up human potential for more creative and strategic work.";

export function FounderCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMissionRevealed, setIsMissionRevealed] = useState(false);

  const handleRevealMission = () => {
    setIsModalOpen(false);
    // Add a slight delay to allow the modal to close before the mission card appears
    setTimeout(() => {
      setIsMissionRevealed(true);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={() => setIsModalOpen(true)}
      >
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
          className="relative w-40 h-40 rounded-full shadow-2xl overflow-hidden border-4 border-white/10"
          animate={{ y: [0, -10, 0] }}
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
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        </motion.div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-center">Taylor Hussey</DialogTitle>
            <DialogDescription className="text-center text-accent">
              Founder & Lead AI Strategist
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            {bio}
          </div>
          <DialogFooter>
            <Button onClick={handleRevealMission} className="w-full">
              Learn about AidSync
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AnimatePresence>
        {isMissionRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            <Card className="flex flex-col h-full rounded-2xl bg-gradient-card backdrop-blur-md border border-primary/30 shadow-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(0,255,210,0.3)] p-6">
                <CardHeader className="items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#00ffd0]/10 flex items-center justify-center mb-4 mx-auto">
                        <Rocket className="w-8 h-8 text-[#00ffd0]" />
                    </div>
                    <CardTitle className="font-headline text-2xl font-bold text-white">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">{mission}</p>
                </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
