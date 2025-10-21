// This file is kept for compatibility but database is now initialized in db.ts
import './db';
import { seedTestUser } from './seed';

// Seed test user
seedTestUser().catch(console.error);

