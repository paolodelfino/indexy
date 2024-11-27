import ActionFetch__BigPaint from "@/actions/ActionFetch__BigPaint";
import { createQuery } from "@/utils/query";

const useQueryBigPaint__Edit = createQuery((id: string) =>
  ActionFetch__BigPaint({ id }),
);
export default useQueryBigPaint__Edit;
