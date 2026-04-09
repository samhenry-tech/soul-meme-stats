export const groupBy = <T, P extends keyof T, K = T[P]>(
  items: readonly T[],
  prop: P,
  mapKey?: (value: T[P], item: T) => K
): Map<K, T[]> =>
  items.reduce((acc, item) => {
    const raw = item[prop];
    const key = mapKey ? mapKey(raw, item) : (raw as unknown as K);

    const group = acc.get(key);
    if (group) {
      group.push(item);
    } else {
      acc.set(key, [item]);
    }

    return acc;
  }, new Map<K, T[]>());

export const getWeekday = (date: Date) => {
  return date.toLocaleDateString("en-AU", { weekday: "long" });
};
