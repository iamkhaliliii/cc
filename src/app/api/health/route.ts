import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const stmt = db.prepare("SELECT COUNT(*) as count FROM users");
    const result = stmt.get() as { count: number };

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        users: result.count,
      },
      version: "1.0.0",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

