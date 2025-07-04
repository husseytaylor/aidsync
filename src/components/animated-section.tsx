"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  delay?: number;
  [key: string]: unknown;
}

// CSS animation for fade-in and slide-up
const fadeInClass = "animated-section-fade-in";

export function AnimatedSection({ children, className, tag = "div", delay = 0, ...rest }: AnimatedSectionProps) {
  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <Tag
      className={cn(fadeInClass, className)}
      style={{ animationDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
