import ActionExists__Resource from "@/actions/ActionExists__Resource";
import { FieldAEditor__Type } from "@/components/AEditor";
import { FieldTextArea__Type } from "@/components/form_ui/FieldTextArea";
import { Selectable } from "kysely";
import { Resource } from "kysely-codegen/dist/db";

export function resource__GetReferences(
  text: FieldTextArea__Type["meta"],
): Pick<Selectable<Resource>, "n">[] {
  const references: Pick<Selectable<Resource>, "n">[] = [];

  // let b = "";
  for (let i = 0; i < text.length; ++i) {
    // b += content[i];
    if (text[i] === "$") {
      let j: number;
      for (
        j = i + 1;
        j < text.length && text[j] >= "0" && text[j] <= "9";
        ++j
      ) {}
      const n = parseInt(text.slice(i + 1, j));
      if (!Number.isNaN(n)) references.push({ n });
      i = j - 1;
    }
  }
  // console.log(b);

  return references;
}

export async function resource__ExtractFromFile(
  meta: FieldAEditor__Type["meta"],
  file: File,
) {
  // console.log("file", file)

  const sha256 = Array.from(
    new Uint8Array(
      await crypto.subtle.digest({ name: "SHA-256" }, await file.arrayBuffer()),
    ),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const image = new Set([
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "ico",
    "tif",
    "tiff",
  ]);

  const ext = file.name.split(".").pop()?.toLowerCase(); // TODO: Try with magic number

  const type: Selectable<Resource>["type"] =
    ext === undefined ? "binary" : image.has(ext) ? "image" : "binary";

  // TODO: Check più sicuri, perché, ad esempio, potrei essere connesso da più dispositivi

  if (
    meta.items.findIndex((it) => it.sha256 === sha256 && it.type === type) !==
    -1
  )
    return undefined;

  const uploadedOnServer = await ActionExists__Resource({ sha256, type });
  if (uploadedOnServer === undefined)
    return {
      buff: await file.arrayBuffer(),
      blob_url: URL.createObjectURL(file),
      sha256,
      type: type,
    } satisfies Pick<
      FieldAEditor__Type["meta"]["items"][number],
      "buff" | "blob_url" | "sha256" | "type"
    >;
  else if (uploadedOnServer.inspiration_id === meta.inspiration_id)
    return {
      buff: await file.arrayBuffer(),
      blob_url: URL.createObjectURL(file),
      sha256,
      type: type,
      n: uploadedOnServer.n,
    } satisfies Pick<
      FieldAEditor__Type["meta"]["items"][number],
      "buff" | "blob_url" | "sha256" | "type" | "n"
    >;
}

export function resource__SetUnused(
  text: FieldTextArea__Type["meta"],
  meta: FieldAEditor__Type["meta"],
  setMeta: (value: Partial<FieldAEditor__Type["meta"]>) => void,
) {
  const references = resource__GetReferences(text);

  const items = meta.items.map((it) => ({
    ...it,
    unused: true,
  }));

  for (let i = 0; i < items.length; ++i) {
    items[i].unused =
      references.findIndex((ref) => items[i].n === ref.n) === -1;
  }

  if (meta.items.some((it, i) => it.unused !== items[i].unused))
    setMeta({ items: items });
}

export function resource__GetUnusedNumber(meta: FieldAEditor__Type["meta"]) {
  return meta.items.filter((it) => it.unused).length;
}
