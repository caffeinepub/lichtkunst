/**
 * Shortens a principal string to first N and last M characters with '...' in between.
 * Example: 'abc12345...xyz9'
 */
export function shortenPrincipal(principal: string, prefixLen = 8, suffixLen = 4): string {
  if (!principal) return '';
  if (principal.length <= prefixLen + suffixLen + 3) return principal;
  return `${principal.slice(0, prefixLen)}...${principal.slice(-suffixLen)}`;
}

/**
 * Returns either the full or shortened principal string based on the `shorten` flag.
 */
export function formatPrincipalForDisplay(principal: string, shorten = true): string {
  if (!principal) return '';
  return shorten ? shortenPrincipal(principal) : principal;
}
