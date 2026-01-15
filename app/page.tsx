import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const { data: auth } = await supabase.auth.getUser();

  // 🔐 If logged in → redirect by role
  if (auth.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin");
    }

    redirect("/profile");
  }

  // 👤 Guest landing page
  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome 👋
      </h1>

      <p className="text-gray-600 mb-6">
        Next.js + Supabase SSR Authentication Setup
      </p>

      <div className="flex gap-4 justify-center">
        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Signup
        </Link>

        <Link
          href="/login"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
