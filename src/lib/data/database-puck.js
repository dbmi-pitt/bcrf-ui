import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';

const instance = await DuckDBInstance.create(process.env.DUCK_DB_PUCK_PERMS_PATH);
export const ppConn = await instance.connect();

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    ppConn.closeSync();
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
