import { fetchInspirationsAction } from "@/actions/fetchInspirationsAction";
import { createInfiniteQuery } from "@/utils/query";

export default createInfiniteQuery(20, (offset, limit) =>
  fetchInspirationsAction(offset, limit),
);
