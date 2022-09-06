// Marks that this part of the code has not been implemented yet.
export const todo = (..._args: unknown[]) => {
  throw new Error("Unimplemented");
};

// Marks that this part of the code should never be logically reachable.
export const unreachable = () => {
  throw new Error("This should be unreachable");
};
