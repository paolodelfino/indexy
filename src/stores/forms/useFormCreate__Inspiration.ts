import { fieldAEditor } from "@/components/AEditor";
import { fieldTextArea } from "@/components/form_ui/FieldTextArea";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { createForm } from "@/utils/form";

export default createForm(
  schemaInspiration__Create,
  {
    content: fieldTextArea(),
    resources: fieldAEditor(),
  },
  {},
);
