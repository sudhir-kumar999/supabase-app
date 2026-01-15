import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        // 🔥 MUST MATCH SUPABASE AUTH SETTINGS
        redirectTo:
          "http://localhost:3000/reset-password/confirm",
      }
    );

    if (error) {
      console.error("RESET PASSWORD ERROR:", error);
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD SERVER ERROR:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
