import bcrypt from "bcryptjs";
import db from "./db";

export async function seedTestUser() {
  try {
    // Check if test user already exists
    const stmt = db.prepare("SELECT * FROM users WHERE phone = ?");
    const existingUser = stmt.get("09124580298");

    if (existingUser) {
      console.log("Test user already exists");
      return;
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

    console.log("✅ Test user created successfully");
    console.log("Mobile: 09124580298");
    console.log("Password: 0298");
  } catch (error) {
    console.error("Error seeding test user:", error);
  }
}

