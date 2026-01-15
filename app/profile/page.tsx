import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, role, created_at")
    .eq("id", auth.user.id)
    .single();

  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/admin");

  // 🔥 FIX: make date SSR-safe
  const safeProfile = {
    ...profile,
    created_at: new Date(profile.created_at).toISOString(),
  };

  return <ProfileClient profile={safeProfile} />;
}
