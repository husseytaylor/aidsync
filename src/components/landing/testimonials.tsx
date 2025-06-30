import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection } from '../animated-section';

const testimonials = [
  {
    name: 'Jenna Riley',
    title: 'Founder, Riley Consulting Group',
    avatar: 'JR',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "woman portrait",
    quote: "The AI agent has saved me at least 10 hours a week by handling initial client questions and booking discovery calls for me. It's like having the perfect assistant 24/7."
  },
  {
    name: 'Marcus Thorne',
    title: 'Owner, Thorne Creative Agency',
    avatar: 'MT',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "man portrait",
    quote: "Our client onboarding is smoother than ever. The system automates document collection and answers repetitive questions, letting my team focus on high-value creative work."
  }
]

export function Testimonials() {
  return (
    <AnimatedSection id="testimonials" className="bg-secondary">
      <div className="container py-24 sm:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">From Overwhelmed to Automated</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how businesses are using AidSync to reclaim their time and scale their operations.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
