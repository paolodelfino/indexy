import fetchBigPaintHistoryAction from "@/actions/fetchBigPaintHistoryAction";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  fetchBigPaintHistoryAction(offset, limit),
);
