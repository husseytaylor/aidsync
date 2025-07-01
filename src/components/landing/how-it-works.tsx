"use client";

import { motion } from 'framer-motion';
import { FileText, PhoneCall, Rocket, ClipboardCheck } from 'lucide-react';

const steps = [
  {
    icon: <PhoneCall className="h-8 w-8 text-accent" />,
    title: '1. Discovery & Intake',
    description: 'Book a call via our site, complete an intake form, and sign the service agreement. We learn about your goals and needs.',
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: '2. Content & Guidance',
    description: 'You receive detailed instructions on uploading your business documents (FAQs, processes, etc.) for AI training.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-accent" />,
    title: '3. Build & Deploy',
    description: 'We deliver your custom-branded website and trained AI agent in approximately two weeks for you to review.',
  },
  {
    icon: <ClipboardCheck className="h-8 w-8 text-accent" />,
    title: '4. Revisions & Launch',
    description: 'After a two-week revision window for your feedback, we complete the final launch and provide a user guide.',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export function HowItWorks() {
  return (
    <motion.section 
      id="how-it-works"
      className="container py-24 sm:py-32"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Your Automation Journey</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From initial call to full deployment in just a few weeks. Here’s our streamlined onboarding process.
        </p>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {steps.map((step, index) => (
          <motion.div key={index} variants={cardVariants} className="h-full">
            <div className="h-full text-center md:text-left bg-card/50 backdrop-blur-md border border-accent/20 rounded-2xl p-6 lg:p-8 flex flex-col items-center md:items-start transition-all duration-300 hover:scale-105 hover:shadow-glow-accent">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-headline text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm flex-grow">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
