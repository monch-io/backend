import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { QueryWithHelpers } from "mongoose";
import { PaginatedResult, Pagination } from "../../../types/pagination";

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
  // Paginate the given mongoose query, and map the result.
  paginateQuery = async <QueryItem, ResultItem, DocType>({
    query,
    mapResult,
    pagination,
  }: PaginateQueryInput<QueryItem, ResultItem, DocType>): Promise<
    PaginatedResult<ResultItem>
  > => {
    if (typeof pagination != "undefined") {
      const { skip, take } = pagination;
      query.skip(skip).limit(take);
    }
    const total = await query.model.countDocuments(query.getFilter());
    const items = await query;
    return { items: items.map(mapResult), total };
  };
}
