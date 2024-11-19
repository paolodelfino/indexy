import fetchInspirationHistoryAction from "@/actions/fetchInspirationHistoryAction"
import { createInfiniteQuery } from "@/utils/query"

export default createInfiniteQuery(20, (offset, limit) =>
  fetchInspirationHistoryAction(offset, limit),
);
