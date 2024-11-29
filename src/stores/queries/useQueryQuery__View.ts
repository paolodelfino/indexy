import ActionFetch__QueryMany from "@/actions/ActionFetch__QueryMany";
import { createInfiniteQuery } from "@/utils/query";

const useQueryQuery__View = createInfiniteQuery(20, (offset, limit) =>
  ActionFetch__QueryMany(offset, limit),
);
export default useQueryQuery__View;
