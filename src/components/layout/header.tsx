import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { logout } from '@/app/auth/actions';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="AidSync Logo" width={24} height={24} />
            <span className="font-bold font-headline text-lg text-primary">AidSync</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard/analytics">Dashboard</Link>
              </Button>
              <form action={logout}>
                <Button variant="outline">Logout</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 pt-6">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image src="/logo.png" alt="AidSync Logo" width={24} height={24} />
                  <span className="font-bold font-headline text-lg text-primary">AidSync</span>
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium">
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
