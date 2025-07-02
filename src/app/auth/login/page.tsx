"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useSearchParams } from 'next/navigation';

const MotionCard = motion(Card);

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/lazer.png"
        alt="Abstract digital flow background"
        fill
        className="object-cover fixed z-[-1] top-0 left-0 w-full h-full"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-[-1]" />

      <div className="flex justify-center items-center min-h-screen relative z-10 px-4">
        <MotionCard
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10 p-8 rounded-3xl w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex justify-center items-center space-x-2 mb-4">
              <Logo className="w-12 h-12" />
              <span className="font-bold font-headline text-2xl text-primary">AidSync</span>
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight text-center mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              Authorized AidSync Personnel Only
            </p>
          </div>

          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="personnel@aidsync.com"
                required
                className="w-full rounded-md px-4 py-2 bg-background/50 border border-white/20 focus:ring-2 focus:ring-accent focus:outline-none text-white placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md px-4 py-2 bg-background/50 border border-white/20 focus:ring-2 focus:ring-accent focus:outline-none text-white"
              />
            </div>

            {message && (
              <p className="text-sm text-center p-2 rounded-md bg-destructive/20 text-destructive-foreground border border-destructive/50">
                {message}
              </p>
            )}
            
            <Button
              type="submit"
              formAction={login}
              className="w-full mt-4"
            >
              Login
            </Button>
          </form>
        </MotionCard>
      </div>
    </div>
  );
}
