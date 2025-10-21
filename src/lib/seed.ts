import bcrypt from "bcryptjs";
import db from "./db";

export async function seedTestUser() {
  try {
    // Check if test user already exists
    const stmt = db.prepare("SELECT * FROM users WHERE phone = ?");
    const existingUser = stmt.get("09124580298");

    if (existingUser) {
      console.log("Test user already exists");
    } else {
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
    }

    // Seed test business
    await seedTestBusiness();
  } catch (error) {
    console.error("Error seeding test user:", error);
  }
}

export async function seedTestBusiness() {
  try {
    // Check if test business already exists
    const stmt = db.prepare("SELECT * FROM businesses WHERE phone = ?");
    const existingBusiness = stmt.get("02144556677");

    if (existingBusiness) {
      console.log("Test business already exists");
      return;
    }

    // Create test business
    const insertBusinessStmt = db.prepare(`
      INSERT INTO businesses (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `);

    const businessResult = insertBusinessStmt.run(
      "فروشگاه تستی",
      "02144556677",
      "business@test.com",
      "تهران، خیابان ولیعصر"
    );

    const businessId = businessResult.lastInsertRowid;

    // Hash password for business user
    const passwordHash = await bcrypt.hash("1234", 10);

    // Create test business user
    const insertBusinessUserStmt = db.prepare(`
      INSERT INTO business_users (business_id, username, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertBusinessUserStmt.run(
      businessId,
      "business1",
      passwordHash,
      "مدیر فروشگاه",
      "admin"
    );

    console.log("✅ Test business created successfully");
    console.log("Username: business1");
    console.log("Password: 1234");
  } catch (error) {
    console.error("Error seeding test business:", error);
  }
}

