export function sortBy<T>(
  array: T[],
  getKey: (item: T) => number | string
): T[] {
  return array.slice().sort((a, b) => {
    const keyA = getKey(a);
    const keyB = getKey(b);

    if (keyA === keyB) {
      return 0;
    }

    return keyA > keyB ? 1 : -1;
  });
}

export function sortDescBy<T>(
  array: T[],
  getKey: (item: T) => number | string
): T[] {
  return array.slice().sort((a, b) => {
    const keyA = getKey(a);
    const keyB = getKey(b);

    if (keyA === keyB) {
      return 0;
    }

    return keyA > keyB ? -1 : 1;
  });
}