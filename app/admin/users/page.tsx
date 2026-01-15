import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminUsersClient from "@/components/AdminUsersClient";

export default async function AdminUsersPage() {
  // 🔐 SSR auth check
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) redirect("/login");

  // 🛡️ role check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (profile?.role !== "admin") redirect("/profile");

  // ✅ DIRECT ADMIN QUERY (NO API, NO COOKIES)
  const { data: users, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, role")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // 🔥 pass data to client component
  return <AdminUsersClient users={users} />;
}
