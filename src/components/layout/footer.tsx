"use client";

import Link from 'next/link';
import { Logo } from '../logo';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer 
      className="w-full border-t border-white/10 bg-background/90 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold font-headline text-lg text-primary">AidSync</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} AidSync. All Rights Reserved.
          </p>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
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
      </div>
    </motion.footer>
  );
}
