
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function ScrollHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const scrollToId = searchParams.get('scrollTo');
    if (scrollToId) {
      const targetElement = document.getElementById(scrollToId);
      if (targetElement) {
        const yOffset = -70; // Account for fixed header height
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });

        // Clean up the URL by removing the query parameter
        // It's the idiomatic Next.js way and prevents re-triggering on refresh.
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [searchParams, router]);

  return null; // This component does not render anything
}
