export const mapUndefined = <T, U>(
  value: T | undefined,
  f: (value: T) => U
): U | undefined => {
  if (typeof value == "undefined") {
    return undefined;
  }
  return f(value);
};

export const mapNull = <T, U>(
  value: T | null,
  f: (value: T) => U
): U | null => {
  if (value === null) {
    return null;
  }
  return f(value);
};
