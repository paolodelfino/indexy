import { fetchInspirationsAction } from "@/actions/ActionFetch__Inspirations";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  fetchInspirationsAction(offset, limit),
);
