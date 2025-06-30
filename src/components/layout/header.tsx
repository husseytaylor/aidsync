"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { Logo } from '../logo';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

export function Header({ user }: { user: User | null }) {
  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

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
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition-colors hover:text-foreground text-foreground/60 after:absolute after:bg-primary after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
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
                  <Logo className="w-8 h-8" />
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
    </motion.header>
  );
}
