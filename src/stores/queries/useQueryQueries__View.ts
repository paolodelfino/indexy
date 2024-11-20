import ActionFetch__Queries from "@/actions/ActionFetch__Queries";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  ActionFetch__Queries(offset, limit),
);
