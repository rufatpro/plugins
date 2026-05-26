/**
 * @param {string} firstId
 */
export function prefixFromFirstId(firstId) {
  const m = firstId.match(/^(.+?)-\d{2}(?:-|$)/);
  if (m) {
    return m[1];
  }
  const m2 = firstId.match(/^(.+)-\d+$/);
  return m2 ? m2[1] : firstId;
}
