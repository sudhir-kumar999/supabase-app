import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { message: "Name must be at least 2 characters" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", auth.user.id);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
