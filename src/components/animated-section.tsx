"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  tag?: keyof typeof motion;
  delay?: number;
  variants?: Variants;
  [key: string]: any;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedSection({ children, className, tag = "div", delay = 0, variants = defaultVariants, ...rest }: AnimatedSectionProps) {
  const MotionComponent = (motion[tag] || motion.div) as any;

  return (
    <MotionComponent
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: delay / 1000 }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
