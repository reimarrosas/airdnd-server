export const hasKey = <K extends string, O extends object>(
  o: O,
  k: K
): o is O & Record<K, unknown> => k in o;
