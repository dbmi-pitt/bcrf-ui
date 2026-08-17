/**
 * Runs `iteratorFn(item)` for every item in `items`, but never more than
 * `concurrency` at a time. This is the entire mechanism behind "multiple
 * simultaneous uploads" — the upload API already accepts one file per
 * request, so true concurrency just means firing several requests in
 * parallel instead of waiting for each to finish before starting the next.
 *
 * A cap (rather than unlimited parallelism) matters for two reasons here:
 *  - SQLite only supports one writer at a time (see lib/db.js), so an
 *    unbounded burst of simultaneous uploads would just queue up behind
 *    each other anyway, with no real benefit and more memory pressure.
 *  - Browsers cap concurrent requests per origin too, so very large
 *    unbounded batches don't actually run any faster past a point.
 *
 * @template T
 * @param {number} concurrency
 * @param {T[]} items
 * @param {(item: T) => Promise<any>} iteratorFn
 * @returns {Promise<PromiseSettledResult<any>[]>}
 */
export async function asyncPool(concurrency, items, iteratorFn) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    results.push(p);

    const cleanup = () => executing.delete(p);
    p.then(cleanup, cleanup);
    executing.add(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.allSettled(results);
}
