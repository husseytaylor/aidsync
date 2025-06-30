import { AnimatedSection } from '../animated-section';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "What’s included at each tier?",
    answer: "Starter includes a website with a contact form and hosting. Growth adds web chat and voice agents. Command Suite includes an internal assistant and advanced analytics. Custom tier offers fully tailored AI systems and workflows."
  },
  {
    question: "What’s the pricing?",
    answer: "Starter: $2,500 setup + $950/mo. Growth: $4,500 setup + $1,500/mo. Command Suite: $7,000 setup + $2,500/mo. Custom plans are scoped and priced per project."
  },
  {
    question: "Can I text the phone number?",
    answer: "Not yet. Our agents currently support voice calls only. SMS capability is under development and coming soon."
  },
  {
    question: "How long does setup take?",
    answer: "The initial build is typically delivered in about 2 weeks, followed by a 2-week revision window before final launch."
  },
  {
    question: "Can I make changes later?",
    answer: "Yes. Your first three major changes in the first month are free. Minor backend and knowledge base updates are always included. Larger feature updates are billed hourly."
  },
  {
    question: "How does the agent know what to say?",
    answer: "We train the AI on your business documents (FAQs, service descriptions, etc.). The agent uses this private knowledge base to answer user questions. If a query is outside its scope, it will politely deflect to human support."
  }
];

export function Faq() {
  return (
    <AnimatedSection id="faq" tag="section" className="container py-24 sm:py-32">
       <div className="max-w-2xl mx-auto text-center">
         <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Frequently Asked Questions</h2>
         <p className="mt-4 text-lg text-muted-foreground">
           Find quick answers to common questions about our services, pricing, and process.
         </p>
       </div>
      <div className="mt-16 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
}
