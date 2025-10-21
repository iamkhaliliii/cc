import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function GET() {
  try {
    // Check if test user already exists
    const stmt = db.prepare("SELECT * FROM users WHERE phone = ?");
    const existingUser = stmt.get("09124580298");

    if (existingUser) {
      return NextResponse.json({
        message: "Test user already exists",
        user: existingUser,
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash("0298", 10);

    // Create test user
    const insertStmt = db.prepare(`
      INSERT INTO users (phone, password_hash, name, email, points)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      "09124580298",
      passwordHash,
      "کاربر آزمایشی",
      "test@example.com",
      1500
    );

    // Get the created user
    const createdUser = stmt.get("09124580298");

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: createdUser,
      credentials: {
        mobile: "09124580298",
        password: "0298",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Error creating test user", details: errorMessage },
      { status: 500 }
    );
  }
}

