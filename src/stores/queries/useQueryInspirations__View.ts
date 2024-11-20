import ActionFetch__Inspirations from "@/actions/ActionFetch__Inspirations";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  ActionFetch__Inspirations(offset, limit),
);
