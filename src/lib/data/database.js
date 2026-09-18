import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';

async function createConnection() {
  const instance = await DuckDBInstance.create(process.env.DUCK_DB_PATH, {
    access_mode: 'READ_ONLY',
  });
  const connection = await instance.connect();
  return { instance, connection };
}

async function shutdown() {
  const state = globalThis._duckDb;
  if (!state || state.isShuttingDown) return;
  state.isShuttingDown = true;

  try {
    state.connection.closeSync();
    state.instance.closeSync();
    log.info('DuckDB connection closed cleanly.');
  } catch (err) {
    log.error('Error closing DuckDB connection:', err);
  }
}

function registerShutdownHandlers() {
  // Guard against re-registering on every Next.js hot reload
  if (globalThis._duckDbShutdownRegistered) return;
  globalThis._duckDbShutdownRegistered = true;

  process.on('SIGINT', async () => {
    await shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await shutdown();
    process.exit(0);
  });
}

/**
 * Gets the shared DuckDB connection, creating it on first call.
 *
 * @returns {Promise<import('@duckdb/node-api').DuckDBConnection>}
 */
export async function getConnection() {
  if (!globalThis._duckDb) {
    globalThis._duckDb = await createConnection();
    registerShutdownHandlers();
  }
  return globalThis._duckDb.connection;
}
