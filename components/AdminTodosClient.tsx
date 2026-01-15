"use client";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
};

export default function AdminTodosClient({
  todos,
}: {
  todos: Todo[];
}) {
  const deleteTodo = async (id: string) => {
    if (!confirm("Delete this todo?")) return;

    await fetch("/api/admin/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todoId: id }),
    });

    window.location.reload();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Admin – Manage Todos
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Todo</th>
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
              <td className="border p-2">{t.profiles.name}</td>
              <td className="border p-2">{t.profiles.email}</td>
              <td className="border p-2 text-sm">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteTodo(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
