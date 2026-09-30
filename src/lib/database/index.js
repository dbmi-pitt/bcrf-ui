import mysql from 'mysql2/promise';
import 'server-only';

function createPool() {
  return mysql.createPool({
    host: process.env.MYSQL_DB_HOST,
    port: Number(process.env.MYSQL_DB_PORT ?? 3306),
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

/**
 * Gets the shared MySQL connection pool.
 *
 * @returns {import('mysql2/promise').Pool}
 */
export function getDatabasePool() {
  // In dev, Next.js hot-reloads modules so reuse the pool across reloads
  if (!globalThis._mysqlPool) {
    globalThis._mysqlPool = createPool();
  }
  return globalThis._mysqlPool;
}
