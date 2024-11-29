import { createForm } from "@/utils/form";
import { z } from "zod";

const useFormQuery__Pool = createForm(
  z.object({}),
  {},
  {
    lastValues: undefined as undefined | { type: string; id: string },
  },
);
export default useFormQuery__Pool;
