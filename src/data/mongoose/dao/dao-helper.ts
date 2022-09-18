import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import { NotFoundException } from "../../../utils/exceptions";

export interface PaginateQueryInput<QueryItem, ResultItem, DocType> {
  query: QueryWithHelpers<
    QueryItem[],
    DocType,
    BeAnObject,
    DocumentType<QueryItem, BeAnObject>
  >;
  mapResult: (result: QueryItem) => ResultItem;
  pagination?: Pagination;
}

export class DaoHelper {
  constructor(
    /**
     * The natural name of the entity
     */
    readonly naturalEntityName: string
  ) {}

  /**
   * Capitalise the natural name of the entity
   */
  capitalisedNaturalEntityName = (): string => {
    return (
      this.naturalEntityName.charAt(0).toUpperCase() +
      this.naturalEntityName.slice(1)
    );
  };

  /**
   * Paginate the given mongoose query, and map the result.
   */
  paginateQuery = async <QueryItem, ResultItem, DocType>({
    query,
    mapResult,
    pagination,
  }: PaginateQueryInput<QueryItem, ResultItem, DocType>): Promise<
    PaginatedResult<ResultItem>
  > => {
    if (typeof pagination !== "undefined") {
      const { skip, take } = pagination;
      query.skip(skip).limit(take);
    }
    const total = await query.model.countDocuments(query.getFilter());
    const items = await query;
    return { items: items.map(mapResult), total };
  };

  /**
   * Ensure that the given id-indexed query has a non-null result, queried by
   * the given id.
   */
  ensureFound = async <
    T,
    DocType,
    Q extends QueryWithHelpers<
      T,
      DocType,
      BeAnObject,
      DocumentType<T, BeAnObject>
    >
  >(
    id: string,
    query: Q
  ): Promise<Awaited<Q> & ({} | undefined)> => {
    const result = await query;
    if (result === null) {
      throw new NotFoundException(
        `${this.capitalisedNaturalEntityName()} with id=${id} not found`
      );
    } else {
      return result;
    }
  };
}
