"use client";

import { motion } from "framer-motion";

export function MotionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      whileInView={{ opacity: 1, width: "100px" }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full mt-3 mx-auto"
    />
  );
}
