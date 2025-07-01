"use client";

import Link from 'next/link';
import { Logo } from '../logo';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer 
      className="w-full border-t border-white/10 bg-black/20 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-10 text-foreground/80 tracking-wide text-sm">
        {/* Left Column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center space-x-2 mb-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold font-headline text-lg text-primary">AidSync</span>
          </Link>
          <p className="text-sm leading-loose text-muted-foreground max-w-xs">
            © {new Date().getFullYear()} AidSync. Intelligent Automation for Humanitarian Organizations.
          </p>
        </div>

        {/* Center Column */}
        <nav className="flex items-center justify-center gap-4 sm:gap-6 text-sm">
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
            Contact
          </Link>
          <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-primary">
            Privacy Policy
          </Link>
        </nav>

        {/* Right Column */}
        <div className="flex justify-center md:justify-end">
            <Button asChild>
                <Link href="/contact#calendly">
                    <Calendar />
                    Discovery Call
                </Link>
            </Button>
        </div>
      </div>
    </motion.footer>
  );
}
