/**
 * Normalizes and validates a user-supplied "virtual path" string.
 *
 * Returns null if the input is invalid, in which case callers should treat
 * the request as a 400/404 (never attempt to "fix" or partially accept it).
 *
 * @param {string} raw
 * @returns {string | null}
 */
export function normalizeVirtualPath(raw) {
  if (typeof raw !== "string" || raw.length === 0) return null;

  // 1. Decode percent-encoding exactly once. If it's malformed, reject.
  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }

  // 2. Reject null bytes and other control characters outright.
  if (/[\x00-\x1f\x7f]/.test(decoded)) return null;

  // 3. Normalize Unicode (NFC) to reduce homograph/lookalike tricks.
  decoded = decoded.normalize("NFC");

  // 4. Split into segments, trim whitespace, drop empty segments.
  //    This collapses "a//b", leading "/", and trailing "/" for free.
  const segments = decoded
    .split("/")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (segments.length === 0 || segments.length > 20) return null; // blank junk or too many slashes

  for (const seg of segments) {
    // No traversal tokens
    if (seg === "." || seg === "..") return null;

    // no extra-long names
    if (seg.length > 255) return null;

    // Allow-list: letters, numbers, dot, underscore, hyphen, space, and parentheses. 
    if (!/^[a-zA-Z0-9._\-\s()]+$/.test(seg)) return null;
  }

  return segments.join("/");
}

/**
 * Escapes SQL LIKE wildcard characters ("%", "_") for safe prefix queries.
 * @param {string} value
 * @returns {string}
 */
export function escapeLike(value) {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}
