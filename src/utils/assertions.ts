import { z } from "zod";

// Mark that this part of the code has not been implemented yet.
export const todo = (..._args: unknown[]) => {
  throw new Error("Unimplemented");
};

// Mark that this part of the code should never be logically reachable.
export const unreachable = () => {
  throw new Error("This should be unreachable");
};

// Assert that the given object conforms to the given zod schema.
export const assertConforms = <T extends z.ZodTypeAny>(
  schema: T,
  value: z.infer<T>
): z.infer<T> => {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Given value "${value}" does not conform to given schema`);
  }
  return result.data;
};
