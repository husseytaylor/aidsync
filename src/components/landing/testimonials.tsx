import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedSection } from '../animated-section';

const testimonials = [
  {
    name: 'Dr. Elena Vance',
    title: 'Director of Global Operations, Hope Foundation',
    avatar: 'EV',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "woman portrait",
    quote: "AidSync revolutionized how we manage disaster relief. The AI-driven insights have been a game-changer, allowing us to deliver aid faster and more efficiently than ever before."
  },
  {
    name: 'Samuel Chen',
    title: 'Logistics Coordinator, World-Wide Aid',
    avatar: 'SC',
    image: 'https://placehold.co/100x100.png',
    dataAiHint: "man portrait",
    quote: "The platform is incredibly intuitive. We onboarded our entire field team in under a week. The real-time collaboration features have drastically improved our on-the-ground coordination."
  }
]

export function Testimonials() {
  return (
    <AnimatedSection id="testimonials" className="bg-secondary">
      <div className="container py-24 sm:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-3xl font-extrabold sm:text-4xl">Trusted by Leaders in Humanitarian Aid</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how organizations are leveraging AidSync to make a difference.
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
