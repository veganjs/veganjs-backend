/**
 * Returns unique param that can be used in where statement
 */
export function getUniqueParam(fieldName: string): string {
  const [seconds, nanoseconds] = process.hrtime()
  return `${fieldName.replace('.', '_')}_${seconds}${nanoseconds}`
}
