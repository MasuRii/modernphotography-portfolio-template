/**
 * URL utility for GitHub Pages base path compatibility
 *
 * When deployed to GitHub Pages with a subdirectory (e.g., /repo-name/),
 * all internal links must be prefixed with the base URL.
 */

/**
 * Joins the base URL with a given path
 * Handles edge cases like double slashes and missing slashes
 *
 * @param path - The path to join with the base URL (e.g., "/shop", "/about")
 * @returns The full path including the base URL
 *
 * @example
 * // When BASE_URL is "/modernphotography-portfolio-template/"
 * getUrl("/shop") // returns "/modernphotography-portfolio-template/shop"
 * getUrl("/") // returns "/modernphotography-portfolio-template/"
 */
export function getUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";

  // Remove leading slash from path if base has trailing slash
  if (base.endsWith("/") && path.startsWith("/")) {
    return base + path.slice(1);
  }

  // Add slash between if neither has one
  if (!base.endsWith("/") && !path.startsWith("/")) {
    return base + "/" + path;
  }

  return base + path;
}
