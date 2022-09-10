import { z } from "zod";

export const Pagination = z.object({
  skip: z.number().int().min(0),
  take: z.number().int().min(1),
});
export interface Pagination extends z.infer<typeof Pagination> {}

export const INFINITE_PAGINATION = {
  skip: 0,
  take: Number.MAX_VALUE,
};

export const PaginatedResult = <T>(item: z.ZodType<T>) =>
  z.object({
    items: item.array(),
    total: z.number().int().min(0),
  });
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
