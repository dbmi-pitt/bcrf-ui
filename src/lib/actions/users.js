import { getConnection } from '@/lib/data/database-puck.js';
import 'server-only';

export const getUsers = async () => {
  const conn = await getConnection();

  const reader = await conn.runAndReadAll('SELECT email, name FROM users');
  const rows = reader.getRowObjects();
  return rows;
};
