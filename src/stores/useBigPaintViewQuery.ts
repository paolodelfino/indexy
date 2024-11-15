import { fetchBigPaintsAction } from "@/actions/fetchBigPaintsAction";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  fetchBigPaintsAction(offset, limit),
);
