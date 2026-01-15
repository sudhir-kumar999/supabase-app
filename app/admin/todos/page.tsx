import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/* =========================
   TYPES (FINAL & CORRECT)
========================= */
type AdminTodo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  profile: {
    name: string;
    email: string;
  } | null;
};

/* =========================
   SERVER ACTION
========================= */
async function deleteTodo(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  if (!id) return;

  await supabaseAdmin.from("todos").delete().eq("id", id);

  revalidatePath("/admin/todos");
}

/* =========================
   PAGE
========================= */
export default async function AdminTodosPage() {
  const supabase = await createSupabaseServerClient();

  // 🔐 Auth check
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // 🔐 Role check
  const { data: roleRow } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (roleRow?.role !== "admin") redirect("/profile");

  /* =========================
     🔥 CORRECT SUPABASE JOIN
     - alias => profile
     - FK hint => todos_user_id_fkey
     - returns OBJECT (not array)
  ========================= */
  const { data, error } = await supabaseAdmin
    .from("todos")
    .select(`
      id,
      title,
      completed,
      created_at,
      profile:profiles!todos_user_id_fkey (
        name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const todos = data as unknown as AdminTodo[];

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Admin – Manage Todos
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Created</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {todos.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.title}</td>

              <td className="border p-2">
                {t.profile?.name ?? "—"}
              </td>

              <td className="border p-2">
                {t.profile?.email ?? "—"}
              </td>

              <td className="border p-2 text-sm">
                {new Date(t.created_at).toDateString()}
              </td>

              <td className="border p-2 text-center">
                <form action={deleteTodo}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
