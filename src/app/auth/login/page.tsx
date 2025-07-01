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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="bg-[#002d2e]/80 rounded-2xl shadow-2xl backdrop-blur-xl p-8 border border-accent/10 hover:shadow-[0_0_20px_rgba(0,255,210,0.3)] transition-all duration-500">
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex justify-center items-center space-x-2 mb-4">
                <Logo className="w-12 h-12" />
                <span className="font-bold font-headline text-2xl text-primary">AidSync</span>
              </Link>
              <h1 className="text-white text-2xl font-headline font-semibold text-center mb-2">
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
                className="bg-gradient-to-r from-[#00FFD0] to-[#0066FF] text-white rounded-md px-4 py-2 w-full mt-4 font-semibold shadow-md hover:shadow-[0_0_15px_rgba(0,255,210,0.4)] transition-all"
              >
                Login
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
