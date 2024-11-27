import ActionFetch__Query from "@/actions/ActionFetch__Query";
import { createQuery } from "@/utils/query";

const useQueryQuery__Edit = createQuery((values: string) =>
  ActionFetch__Query({ values }),
);
export default useQueryQuery__Edit;
