
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="dashboard-wrapper">
      <div className="fixed inset-0 -z-10 h-full w-full bg-[url('/rough.png')] bg-cover bg-center bg-no-repeat" />
      {children}
    </div>
  );
}
