export function groupBy<T, TR>(
  array: T[],
  getKey: (item: T) => TR
): { key: TR; values: T[] }[] {
  if (!array || array.length === 0) {
    return [];
  }

  return array.reduce((rv, x) => {
    const key = getKey(x);
    let pair = rv.find((r) => r.key === key);

    if (!pair) {
      pair = { key, values: new Array<T>() };
      rv.push(pair);
    }

    pair.values.push(x);
    return rv;
  }, new Array<{ key: TR; values: T[] }>());
}
