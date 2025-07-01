"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Calendar } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { Logo } from '../logo';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#demo', label: 'Demo' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  const [activeLink, setActiveLink] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const contactSection = document.getElementById('contact');
      // Set a large number if contact section is not on the page
      const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;

      // Header should become opaque if scrolled more than 50px OR if the top of the contact section is near the top of the viewport
      if (offset > 50 || contactTop < 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll Spy Logic
      if (pathname !== '/') return;
      const scrollSpyOffset = 80; // Header height + buffer
      let currentSectionId = '';

      for (const link of navLinks) {
        const section = document.getElementById(link.href.substring(1));
        if (section) {
          const sectionTop = section.offsetTop - scrollSpyOffset;
          const sectionHeight = section.offsetHeight;
          if (offset >= sectionTop && offset < sectionTop + sectionHeight) {
            currentSectionId = section.id;
            break;
          }
        }
      }

      if (window.innerHeight + offset >= document.body.offsetHeight - 50) {
        currentSectionId = navLinks[navLinks.length - 1].href.substring(1);
      }
      setActiveLink(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, navLinks]);
  
  const isLandingPage = pathname === '/';

  const buttonStyle = isScrolled ? '' : 'bg-white/10 hover:bg-white/20 text-white';

  return (
    <motion.header 
      id="site-header"
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        isScrolled
          ? 'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 border-white/10 shadow-md'
          : 'bg-background/80 backdrop-blur-sm border-transparent'
      )}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold font-headline text-lg text-primary">AidSync</span>
          </Link>
        </div>
        {isLandingPage && (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition-colors after:absolute after:bg-accent after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left",
                  isScrolled ? 'text-foreground/80 hover:text-accent' : 'text-foreground/70 hover:text-foreground',
                  activeLink === link.href.substring(1) && "text-accent after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <Button asChild size="sm" className="rounded-full font-bold">
                  <Link href="/dashboard/analytics">Dashboard</Link>
                </Button>
                <form action={logout}>
                  <Button size="sm" className="rounded-full font-bold">Logout</Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild size="sm" className={cn("rounded-full font-bold", buttonStyle)}>
                  <Link href="tel:6624986621">
                    <Phone />
                    <span>Call Agent</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className={cn("rounded-full font-bold", buttonStyle)}>
                  <Link href="#contact">
                    <Calendar />
                    <span>Book a Call</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className={cn("rounded-full font-bold", buttonStyle)}>
                  <Link href="/auth/login">Log In</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? 'text-foreground' : 'text-white')}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex h-full flex-col">
                  <div className="flex-1 space-y-4 pt-6">
                    <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setIsSheetOpen(false)}>
                      <Logo className="w-8 h-8" />
                      <span className="font-bold font-headline text-lg text-primary">AidSync</span>
                    </Link>
                    {isLandingPage && navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        className="block text-lg font-medium"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-3 border-t pt-6">
                   {user ? (
                      <>
                        <Button asChild className="w-full justify-center">
                          <Link href="/dashboard/analytics" onClick={() => setIsSheetOpen(false)}>Dashboard</Link>
                        </Button>
                        <form action={logout} className="w-full">
                           <Button className="w-full justify-center">Logout</Button>
                        </form>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full justify-center">
                          <Link href="tel:6624986621" onClick={() => setIsSheetOpen(false)}>
                              <Phone />
                              <span>Call Voice Agent</span>
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-center">
                          <Link href="#contact" onClick={() => setIsSheetOpen(false)}>
                              <Calendar />
                              <span>Book a Discovery Call</span>
                          </Link>
                        </Button>
                        <Button asChild className="w-full justify-center">
                          <Link href="/auth/login" onClick={() => setIsSheetOpen(false)}>
                            Log In
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
