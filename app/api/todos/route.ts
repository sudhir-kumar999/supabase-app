import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { title } = await req.json();

  // 🔥 IMPORTANT CHANGE: return inserted todo
  const { data, error } = await supabase
    .from("todos")
    .insert({
      title,
      user_id: auth.user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await req.json();

  await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id); // 🔒 safety

  return NextResponse.json({ success: true });
}
