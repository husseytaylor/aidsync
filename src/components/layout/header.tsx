
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, Calendar, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '@/app/auth/actions';
import { Logo } from '../logo';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const landingNavLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#demo', label: 'Demo' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

const mainNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const publicNavLinks = [...landingNavLinks, ...mainNavLinks];

const dashboardNavLinks = [
  { href: '/dashboard/analytics', label: 'Analytics' },
]

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLandingPage = pathname === '/';
  const isDashboard = pathname.startsWith('/dashboard');
  
  const [activeLink, setActiveLink] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);

      // Scroll spy only on landing page
      if (!isLandingPage) {
        setActiveLink('');
        return;
      };

      const scrollSpyOffset = 80;
      let currentSectionId = '';
      const sections = landingNavLinks.map(link => document.getElementById(link.href.substring(1))).filter(Boolean);

      for (const section of sections) {
        if(section) {
            const sectionTop = section.offsetTop - scrollSpyOffset;
            const sectionHeight = section.offsetHeight;
            if (offset >= sectionTop && offset < sectionTop + sectionHeight) {
                currentSectionId = section.id;
                break;
            }
        }
      }
      setActiveLink(currentSectionId);
    };

    let ticking = false;
    const debouncedHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [isLandingPage]);
  
  const getInitials = (email?: string | null) => {
    return email?.substring(0, 2).toUpperCase() || "AD";
  }

  const renderNavLink = (link: { href: string; label: string }, isMobile = false) => {
    const isAnchor = link.href.startsWith('#');
    const finalHref = isAnchor ? `/${link.href}` : link.href;
    
    const clickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isMobile) {
            setIsSheetOpen(false);
        }
        
        if (isAnchor) {
            e.preventDefault();
            const targetId = link.href.substring(1);

            if (isLandingPage) {
                const targetElement = document.getElementById(targetId);
                if(targetElement) {
                    const yOffset = -70;
                    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            } else {
                router.push(`/?scrollTo=${targetId}`);
            }
        }
    };
    
    const navLinkClasses = cn(
      "relative transition-colors after:absolute after:bg-accent after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left",
      'text-foreground/80 hover:text-accent',
      ((isAnchor && activeLink === link.href.substring(1)) || (!isAnchor && pathname === link.href)) && "text-accent after:scale-x-100",
      isMobile ? "block text-lg font-medium" : "text-sm font-medium"
    );

    return (
        <Link href={finalHref} key={link.href} onClick={clickHandler} className={navLinkClasses}>
            {link.label}
        </Link>
    );
  };

  const navLinksToRender = isDashboard ? dashboardNavLinks : publicNavLinks;

  const renderAuthControls = () => {
    if (!isMounted) {
      return null; // Render nothing on the server and initial client render to prevent hydration mismatch
    }

    if (user) {
      if (isDashboard) {
        return (
          <form action={logout}>
            <Button size="sm" className="rounded-full font-bold">
              <LogOut />
              <span>Logout</span>
            </Button>
          </form>
        );
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full" aria-label="Open user menu">
              <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/analytics"><LayoutDashboard />Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Settings</DropdownMenuItem>
            <DropdownMenuItem disabled>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem asChild>
                  <button type="submit" className="w-full text-left"><LogOut />Logout</button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <>
          <Button asChild size="sm" className="rounded-full font-bold">
            <Link href="tel:6624986621">
              <Phone />
              <span>Call Agent</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full font-bold">
              <Link href="/contact#calendly">
                  <Calendar />
                  <span>Discovery Call</span>
              </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full font-bold">
            <Link href="/auth/login">Log In</Link>
          </Button>
        </>
      );
    }
  };

  const renderMobileAuthControls = () => {
    if (!isMounted) {
      return null;
    }

    if (user) {
      if (isDashboard) {
        return (
          <form action={logout} className="w-full">
            <Button className="w-full justify-center">
              <LogOut />
              <span>Logout</span>
            </Button>
          </form>
        );
      }
      return (
        <>
          <Button asChild className="w-full justify-center">
            <Link href="/dashboard/analytics" onClick={() => setIsSheetOpen(false)}>Dashboard</Link>
          </Button>
          <form action={logout} className="w-full">
            <Button className="w-full justify-center" variant="outline">Logout</Button>
          </form>
        </>
      );
    } else {
      return (
        <>
          <Button asChild className="w-full justify-center">
            <Link href="tel:6624986621" onClick={() => setIsSheetOpen(false)}>
                <Phone />
                <span>Call Voice Agent</span>
            </Link>
          </Button>
            <Button asChild className="w-full justify-center">
              <Link href="/contact#calendly" onClick={() => setIsSheetOpen(false)}>
                  <Calendar />
                  <span>Discovery Call</span>
              </Link>
          </Button>
          <Button asChild className="w-full justify-center" variant="outline">
            <Link href="/auth/login" onClick={() => setIsSheetOpen(false)}>
              Log In
            </Link>
          </Button>
        </>
      );
    }
  };

  return (
    <motion.header 
      id="site-header"
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        (isScrolled || isDashboard)
          ? 'bg-black/30 backdrop-blur-lg border-b border-white/10 shadow-md'
          : 'bg-transparent border-transparent'
      )}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex md:mr-6">
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="hidden font-headline text-xl font-bold tracking-tight text-primary sm:inline">AidSync</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
            {navLinksToRender.map((link) => renderNavLink(link))}
        </nav>
        
        <div className="flex flex-1 items-center justify-end">
          <div className="hidden md:flex items-center space-x-2">
            {renderAuthControls()}
          </div>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn((isScrolled || isDashboard) ? 'text-foreground' : 'text-white')} aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex h-full flex-col">
                  <div className="flex-1 space-y-4 pt-6">
                    <Link href="/" className="group flex items-center gap-2 mb-4" onClick={() => setIsSheetOpen(false)}>
                      <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
                      <span className="font-headline text-xl font-bold tracking-tight text-primary">AidSync</span>
                    </Link>
                    {navLinksToRender.map((link) => renderNavLink(link, true))}
                  </div>
                  <div className="flex flex-col space-y-3 border-t pt-6">
                    {renderMobileAuthControls()}
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
