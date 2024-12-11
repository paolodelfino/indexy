import ActionFetch__GraphData from "@/actions/ActionFetch__GraphData";
import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import { FormValues } from "@/utils/form";
import { createQuery } from "@/utils/query";

const useQueryGraph__Fetch = createQuery(
  (values: FormValues<typeof schemaGraph__Fetch>) =>
    ActionFetch__GraphData(values),
);
export default useQueryGraph__Fetch;
