import ActionFetch__Inspiration from "@/actions/ActionFetch__Inspiration";
import { createQuery } from "@/utils/query";

const useQueryInspiration__Edit = createQuery((id: string) =>
  ActionFetch__Inspiration({ id }),
);
export default useQueryInspiration__Edit;
