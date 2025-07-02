"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AidSyncLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0B3D2E] via-[#3FA419] to-[#48D1CC] text-white overflow-hidden">
      {/* Animated Background Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-accent/20 blur-3xl"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* AidSync Logo */}
      <motion.img
        src="/logo.svg"
        alt="AidSync Logo"
        className="w-32 h-32 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      />

      {/* Loading Text */}
      <motion.div
        className="mt-6 text-xl font-semibold tracking-wide z-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </motion.span>
        <span>Loading AidSync</span>
      </motion.div>
    </div>
  );
}
