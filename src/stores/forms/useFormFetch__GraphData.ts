import { createForm } from "@/utils/form";
import { z } from "zod";

const useFormFetch__GraphData = createForm(
  z.object({}),
  {},
  { lastValues: undefined as undefined | { type: string; id: string } },
);
export default useFormFetch__GraphData;
