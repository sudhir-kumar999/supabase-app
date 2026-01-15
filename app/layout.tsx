import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Supabase SSR Auth",
  description: "Next.js + Supabase SSR Authentication with Tailwind",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  let role: "user" | "admin" | null = null;

  if (auth.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    role = profile?.role ?? "user";
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <Navbar
          isLoggedIn={!!auth.user}
          role={role}
        />

        <main className="flex justify-center items-center py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
