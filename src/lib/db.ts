import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
// In production with volume mount, DATA_DIR should point to a mounted volume (e.g., /data)
// In development or when DATA_DIR is not set, it defaults to ./data
const isDevelopment = process.env.NODE_ENV !== 'production';
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

// Only create directory if it doesn't exist and we have permission
if (!fs.existsSync(dataDir)) {
  try {
    // In development, create the directory
    // In production, the directory should already exist (mounted volume)
    if (isDevelopment || !dataDir.startsWith('/data')) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory:', dataDir);
    } else {
      console.warn('Data directory does not exist and cannot be created:', dataDir);
      console.warn('Make sure to mount a volume to this path in production');
    }
  } catch (error) {
    console.error('Failed to create data directory:', error);
    console.error('Falling back to process.cwd()/data');
    // Fallback to current directory if /data is not accessible
  }
}

const dbPath = path.join(dataDir, 'customer-club.db');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema immediately
function initDatabase() {
  // Users table (customers)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone VARCHAR(20) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Businesses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100),
      address TEXT,
      logo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Business users (employees/owners)
  db.exec(`
    CREATE TABLE IF NOT EXISTS business_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'staff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      business_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      points_earned INTEGER DEFAULT 0,
      description TEXT,
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    )
  `);

  // Rewards table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_id INTEGER NOT NULL,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      points_required INTEGER NOT NULL,
      image_url TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    )
  `);

  // Reward redemptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reward_id INTEGER NOT NULL,
      points_spent INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized successfully');
}

// Initialize database on module load
initDatabase();

// Get all users
export const getUsers = db.prepare('SELECT * FROM users ORDER BY created_at DESC');

// Get user by phone
export const getUserByPhone = db.prepare('SELECT * FROM users WHERE phone = ?');

// Create new user
export const createUser = db.prepare(`
  INSERT INTO users (phone, name, email)
  VALUES (?, ?, ?)
`);

// Get all businesses
export const getBusinesses = db.prepare('SELECT * FROM businesses ORDER BY created_at DESC');

// Get business by id
export const getBusinessById = db.prepare('SELECT * FROM businesses WHERE id = ?');

// Create new business
export const createBusiness = db.prepare(`
  INSERT INTO businesses (name, phone, email, address)
  VALUES (?, ?, ?, ?)
`);

// Get user transactions
export const getUserTransactions = db.prepare(`
  SELECT t.*, b.name as business_name
  FROM transactions t
  JOIN businesses b ON t.business_id = b.id
  WHERE t.user_id = ?
  ORDER BY t.transaction_date DESC
`);

// Create transaction
export const createTransaction = db.prepare(`
  INSERT INTO transactions (user_id, business_id, amount, points_earned, description)
  VALUES (?, ?, ?, ?, ?)
`);

// Update user points
export const updateUserPoints = db.prepare(`
  UPDATE users SET points = points + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
`);

// Get active rewards for business
export const getActiveRewards = db.prepare(`
  SELECT * FROM rewards
  WHERE business_id = ? AND is_active = 1
  ORDER BY points_required ASC
`);

export default db;

