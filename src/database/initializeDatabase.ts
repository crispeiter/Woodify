import { type SQLiteDatabase } from "expo-sqlite"

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            isComplete BOOLEAN NOT NULL DEFAULT 0,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            position INTEGER
        )
    `);
}