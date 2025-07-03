
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
import { useEffect, useState } from "react";

const MotionCard = motion(Card);

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/lazer.png"
        alt="Abstract digital flow background"
        fill
        className="object-cover fixed z-[-1] top-0 left-0 w-full h-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-[-1]" />

      <div className="flex justify-center items-center min-h-screen relative z-10 px-4">
        <MotionCard
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-card/90 backdrop-blur-lg"
        >
          <div className="p-8">
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
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white/80">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
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
          </div>
        </MotionCard>
      </div>
    </div>
  );
}
