import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const supabase = await createSupabaseServerClient();

    const res = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SUPABASE SIGNUP RESPONSE:", res);

    if (res.error) {
      return NextResponse.json(
        { message: res.error.message },
        { status: 400 }
      );
    }

    if (res.data.user) {
      const profileRes = await supabase.from("profiles").insert({
        id: res.data.user.id,
        name,
        email,
        role: "user",
      });

      console.log("PROFILE INSERT RESPONSE:", profileRes);

      if (profileRes.error) {
        return NextResponse.json(
          { message: profileRes.error.message },
          { status: 500 }
        );
      }
    }

    // 🔥 IMPORTANT FIX: logout after signup
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SERVER CRASH:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
