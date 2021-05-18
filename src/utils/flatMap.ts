export function flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]): U[] {
  if (!array) {
    return [];
  }

  return array.reduce((cumulus: U[], next: T) => [...mapFunc(next), ...cumulus], [] as U[]);
}
