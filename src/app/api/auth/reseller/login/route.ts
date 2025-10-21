import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

interface Reseller {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  email: string | null;
  phone: string | null;
  commission_rate: number;
  is_active: number;
  created_at: string;
  updated_at: string;
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

    // Get reseller by username
    const stmt = db.prepare("SELECT * FROM resellers WHERE username = ?");
    const reseller = stmt.get(username) as Reseller | undefined;

    if (!reseller) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Check if active
    if (!reseller.is_active) {
      return NextResponse.json(
        { error: "حساب کاربری شما غیرفعال است" },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, reseller.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...resellerWithoutPassword } = reseller;

    return NextResponse.json({
      success: true,
      user: resellerWithoutPassword,
    });
  } catch (error) {
    console.error("Reseller login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود به سیستم" },
      { status: 500 }
    );
  }
}

