export function sumBy<T>(
  array: T[],
  func: (item: T) => number,
  initial?: number
): number {
  if (!array) {
    return 0;
  }

  return array.reduce((prev, current) => prev + func(current), initial || 0);
}