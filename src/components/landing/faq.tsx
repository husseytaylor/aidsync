
"use client";

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layers, DollarSign, MessageSquare, Clock, Pencil, Bot } from 'lucide-react';
import { Card } from '../ui/card';
import { MotionDivider } from '../motion-divider';

const faqs = [
  {
    icon: <Layers className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "What’s included at each tier?",
    answer: "Starter includes a website with a contact form and hosting. Growth adds web chat and voice agents. Command Suite includes an internal assistant and advanced analytics. Custom tier offers fully tailored AI systems and workflows."
  },
  {
    icon: <DollarSign className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "What’s the pricing?",
    answer: "Starter: $2,500 setup + $950/mo. Growth: $4,500 setup + $1,500/mo. Command Suite: $7,000 setup + $2,500/mo. Custom plans are scoped and priced per project."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "Can I text the phone number?",
    answer: "Not yet. Our agents currently support voice calls only. SMS capability is under development and coming soon."
  },
  {
    icon: <Clock className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "How long does setup take?",
    answer: "The initial build is typically delivered in about 2 weeks, followed by a 2-week revision window before final launch."
  },
  {
    icon: <Pencil className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "Can I make changes later?",
    answer: "Yes. Your first three major changes in the first month are free. Minor backend and knowledge base updates are always included. Larger feature updates are billed hourly."
  },
  {
    icon: <Bot className="h-6 w-6 text-accent flex-shrink-0" />,
    question: "How does the agent know what to say?",
    answer: "We train the AI on your business documents (FAQs, service descriptions, etc.). The agent uses this private knowledge base to answer user questions. If a query is outside its scope, it will politely deflect to human support."
  }
];

export function Faq() {
  return (
    <motion.section 
      id="faq" 
      className="container py-24 sm:py-32 scroll-mt-20"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Card className="max-w-3xl mx-auto p-6 sm:p-8 md:p-10">
         <div className="text-center mb-12">
           <h2 className="font-headline text-4xl font-extrabold">Frequently Asked Questions</h2>
           <MotionDivider />
           <p className="mt-4 text-lg text-muted-foreground">
             Find quick answers to common questions about our services, pricing, and process.
           </p>
         </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger>
                <div className="flex items-center gap-4 text-left">
                  {faq.icon}
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </motion.section>
  );
}
