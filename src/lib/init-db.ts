import { initDatabase } from './db';

// Initialize the database when the module is first loaded
try {
  initDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
}

