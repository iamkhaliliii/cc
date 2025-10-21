import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

interface SuperAdmin {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  email: string | null;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // Get superadmin by username
    const stmt = db.prepare("SELECT * FROM superadmins WHERE username = ?");
    const admin = stmt.get(username) as SuperAdmin | undefined;

    if (!admin) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      user: adminWithoutPassword,
    });
  } catch (error) {
    console.error("SuperAdmin login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود به سیستم" },
      { status: 500 }
    );
  }
}

