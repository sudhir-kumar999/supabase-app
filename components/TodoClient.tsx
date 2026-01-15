"use client";

import { useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TodoClient({ todos }: { todos: Todo[] }) {
  const [list, setList] = useState<Todo[]>(todos);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const addTodo = async () => {
    if (!title.trim()) return;

    setLoading(true);

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    setLoading(false);
    setTitle("");

    // 🔥 update state instead of reload
    setList((prev) => [
      {
        id: data.id,       // API should return inserted todo
        title,
        completed: false,
      },
      ...prev,
    ]);
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    // 🔥 update state instead of reload
    setList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        My Todos
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Enter todo"
        />
        <button
          onClick={addTodo}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {list.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <span>{todo.title}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
