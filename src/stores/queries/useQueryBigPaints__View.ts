import ActionFetch__BigPaints from "@/actions/ActionFetch__BigPaints";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  ActionFetch__BigPaints(offset, limit),
);