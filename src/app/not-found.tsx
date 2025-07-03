
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, SearchX } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-14rem)] py-20">
        <AnimatedSection>
          <Card className="max-w-lg w-full text-center p-8">
              <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                      <SearchX className="w-10 h-10 text-destructive" />
                  </div>
                  <CardTitle className="font-headline text-5xl font-extrabold text-foreground">404 - Not Found</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mt-4">
                      The page you are looking for does not exist. It might have been moved or deleted.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Button asChild>
                      <Link href="/">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Return to Homepage
                      </Link>
                  </Button>
              </CardContent>
          </Card>
        </AnimatedSection>
    </div>
  );
}
