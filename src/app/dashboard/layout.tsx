import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      {/* 
        This div applies the specific dashboard background. 
        It overlays the root layout's background, which is the intended effect.
        The root layout provides the main structure (<Header>, <main>, etc.),
        and this layout's primary jobs are to enforce authentication and set the correct background.
      */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[url('/rough.png')] bg-cover bg-center bg-no-repeat" />
      {children}
    </>
  );
}
