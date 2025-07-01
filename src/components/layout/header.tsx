"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      // Don't run scroll spy on non-landing pages
      if (pathname !== '/') return;

      const offset = 80; // Header height + buffer
      const scrollY = window.scrollY;
      let currentSectionId = '';

      for (const link of navLinks) {
        const section = document.getElementById(link.href.substring(1));
        if (section) {
          const sectionTop = section.offsetTop - offset;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.id;
            break;
          }
        }
      }

      // Special case for the bottom of the page
      if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
        currentSectionId = navLinks[navLinks.length - 1].href.substring(1);
      }

      setActiveLink(currentSectionId);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, navLinks]);
  
  const isLandingPage = pathname === '/';

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
                  "relative transition-colors text-foreground/60 hover:text-accent after:absolute after:bg-accent after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left",
                  activeLink === link.href.substring(1) && "text-accent after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Button asChild>
                <Link href="/dashboard/analytics">Dashboard</Link>
              </Button>
              <form action={logout}>
                <Button>Logout</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        {isLandingPage && (
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 pt-6">
                  <Link href="/" className="flex items-center space-x-2 mb-4" onClick={() => setIsSheetOpen(false)}>
                    <Logo className="w-8 h-8" />
                    <span className="font-bold font-headline text-lg text-primary">AidSync</span>
                  </Link>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="text-lg font-medium"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </motion.header>
  );
}
