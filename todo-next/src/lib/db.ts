import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

// process.cwd() はプロジェクトのルート（todo-next）を指します
const dbPath = path.join(process.cwd(), 'database.sqlite');

export async function openDB() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function initDB() {
  const db = await openDB();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('ーーー SQLite データベースの準備が完了しました ーーー');
}