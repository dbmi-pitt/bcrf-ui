const PUBLIC_PATHS = ['/', '/login', '/about', '/unauthorized', '/terms-and-conditions', '/privacy-policy'];

/**
 * Returns whether a pathname requires authentication.
 *
 * @param {string} pathname
 *
 * @returns {boolean}
 */
export function isProtectedPath(pathname) {
  return !PUBLIC_PATHS.some((path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}
