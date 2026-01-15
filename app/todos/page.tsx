import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TodoClient from "@/components/TodoClient";

export default async function TodosPage() {
  const supabase = await createSupabaseServerClient();

  // 🔐 Auth check
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // 🔹 Fetch user todos
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return <TodoClient todos={todos} />;
}
