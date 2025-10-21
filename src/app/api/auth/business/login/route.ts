import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

interface BusinessUser {
  id: number;
  business_id: number;
  username: string;
  password_hash: string;
  name: string;
  role: string;
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

    // Get business user by username
    const stmt = db.prepare("SELECT * FROM business_users WHERE username = ?");
    const businessUser = stmt.get(username) as BusinessUser | undefined;

    if (!businessUser) {
      return NextResponse.json(
        { error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, businessUser.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Get business info
    const businessStmt = db.prepare("SELECT * FROM businesses WHERE id = ?");
    const business = businessStmt.get(businessUser.business_id);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = businessUser;

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        business,
      },
    });
  } catch (error) {
    console.error("Business login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود به سیستم" },
      { status: 500 }
    );
  }
}

