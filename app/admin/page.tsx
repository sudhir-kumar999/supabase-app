import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  // 🔐 Auth check
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // 🛡️ Role check
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", auth.user.id)
    .single();

  if (profile?.role !== "admin") redirect("/profile");

  // ✅ NO FETCH USERS HERE
  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-6 text-center">
        Welcome, <span className="font-semibold">{profile.name}</span>
      </p>

      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="block w-full text-center bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Manage Users
        </Link>

        <Link
          href="/admin/todos"
          className="block w-full text-center bg-gray-700 text-white py-2 rounded hover:bg-gray-900"
        >
          Manage Todos
        </Link>
      </div>
    </div>
  );
}
