import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      <Image
        src="/logo.svg"
        alt="AidSync Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
