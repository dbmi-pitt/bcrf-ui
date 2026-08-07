import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';

const instance = await DuckDBInstance.create(process.env.DUCK_DB_PATH, {
  access_mode: 'READ_ONLY',
});
export const connection = await instance.connect();

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    connection.closeSync();
    instance.closeSync();
    log.info('DuckDB connection closed cleanly.');
  } catch (err) {
    log.error('Error closing DuckDB connection:', err);
  }
}

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});
