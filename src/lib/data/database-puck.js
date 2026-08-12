import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';


const globalForDuckDB = globalThis;

const MODULE_ID = Math.random().toString(36).slice(2);
// console.log("MODULE LOADED:", MODULE_ID, "pid:", process.pid);



let connectionPromise;

export async function getConnection() {
  // console.log("getConnection called, module:", MODULE_ID, "existing promise:", !!connectionPromise);
  // if (!connectionPromise) {
  //   connectionPromise = DuckDBInstance.fromCache(process.env.DUCK_DB_PUCK_PERMS_PATH).then((instance) =>
  //     instance.connect()
  //   ).catch((err) => {
  //       connectionPromise = null; // allow retry on next call
  //       console.log(err)
  //       throw err;
  //     });;
  // }
  // return connectionPromise;

    if (!globalForDuckDB.connectionPromise) {
    globalForDuckDB.connectionPromise = DuckDBInstance.fromCache(process.env.DUCK_DB_PUCK_PERMS_PATH)
      .then((instance) => instance.connect())
      .catch((err) => {
        globalForDuckDB.connectionPromise = null;
        throw err;
      });
  }
  return globalForDuckDB.connectionPromise;

}

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    connectionPromise.closeSync();
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
