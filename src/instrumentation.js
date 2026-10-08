import log from 'xac-loglevel';
import { getLogLevel } from './lib/envs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Code here runs once when the Node.js server starts
    log.setConfig({ level: getLogLevel() });
    log.info('Server initialized', getLogLevel());
    log.setPath(log.getConfigPath());
  }
}
