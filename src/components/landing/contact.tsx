"use client";

import { motion } from 'framer-motion';

export function Contact() {
  return (
    <motion.section
      id="contact"
      className="container py-24 sm:py-32 scroll-mt-20"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold">
          Let’s Build Your Automation System
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Book a free discovery call to explore how AidSync can streamline your workflows.
        </p>
      </div>

      <div
        className="rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg overflow-hidden p-4"
      >
        <iframe
          src="https://calendly.com/cthussey2/new-meeting?primary_color=00A693"
          width="100%"
          height="100%"
          className="rounded-xl border-none"
          style={{ minHeight: '800px' }}
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </motion.section>
  );
}
