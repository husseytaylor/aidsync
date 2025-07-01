"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export async function login(formData: FormData) {
  const supabase = createClient();
  const rawFormData = Object.fromEntries(formData.entries());
  
  const validatedFields = loginSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return redirect("/auth/login?message=Invalid email or password.");
  }
  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return redirect(`/auth/login?message=${encodeURIComponent(error.message)}`);
  }

  return redirect("/dashboard/analytics");
}

export async function signup(formData: FormData) {
  const origin = headers().get("origin");
  const supabase = createClient();
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = signupSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return redirect("/auth/signup?message=Invalid email or password.");
  }
  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error.message);
    return redirect(`/auth/signup?message=${encodeURIComponent(error.message)}`);
  }

  return redirect("/auth/signup?message=Check email to continue sign in process");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
}
