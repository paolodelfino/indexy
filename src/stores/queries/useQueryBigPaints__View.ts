import { fetchBigPaintsAction } from "@/actions/ActionFetch__BigPaints";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  fetchBigPaintsAction(offset, limit),
);
