"use client";

import { motion } from 'framer-motion';
import { Logo } from './logo';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0B3D2E] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Logo className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <p className="text-lg tracking-widest text-accent">Loading...</p>
      </motion.div>
    </div>
  );
}
