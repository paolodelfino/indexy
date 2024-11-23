import { fieldContentAndUploads } from "@/components/form_ui/FieldContentAndUploads";
import { fieldTextArea } from "@/components/form_ui/FieldTextArea";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { createForm } from "@/utils/form";

export default createForm(
  schemaInspiration__Create,
  {
    content: fieldTextArea(),
    resources: fieldContentAndUploads(),
  },
  {},
);
