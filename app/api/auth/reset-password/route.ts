import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Invalid token or password" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // ✅ Step 1: verify recovery token
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (verifyError) {
      console.error("VERIFY OTP ERROR:", verifyError);
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // ✅ Step 2: update password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      console.error("UPDATE PASSWORD ERROR:", updateError);
      return NextResponse.json(
        { message: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("RESET PASSWORD SERVER ERROR:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
