"use client";

import { FieldLabel } from "@puckeditor/core";
import { FileEmbedRender } from "./file-embed-render";
import FilePickerField from "./file-picker-field";

/**
 * Builds a Puck component config for embedding an uploaded file (image or
 * link), scoped to one source. Call this once wherever you build your
 * Puck config, with the sourceId for the page/site being edited:
 *
 *   import { createFileEmbedConfig } from "@/components/puck/file-embed/file-embed-config";
 *
 *   const config = {
 *     components: {
 *       FileEmbed: createFileEmbedConfig(sourceId),
 *       // ...your other components
 *     },
 *   };
 *
 * The sourceId is baked into the component config (not stored per-block),
 * since a single Puck page/site is generally tied to one source's files.
 * If you need per-block source selection instead, add a "sourceId" field
 * and thread it through to FilePickerField's prop instead of closing over
 * it here.
 *
 * @param {string} sourceId
 */
export function createFileEmbedConfig(sourceId) {
  return {
    fields: {
      file: {
        type: "custom",
        label: "File",
        render: ({ field, value, onChange }) => (
          <FieldLabel label={field.label || "File"}>
            <FilePickerField sourceId={sourceId} value={value} onChange={onChange} />
          </FieldLabel>
        ),
      },
      displayAs: {
        type: "select",
        label: "Display as",
        options: [
          { label: "Auto (image if possible, else link)", value: "auto" },
          { label: "Image", value: "image" },
          { label: "Link", value: "link" },
        ],
      },
      alt: {
        type: "text",
        label: "Alt text (used when shown as an image)",
      },
      linkText: {
        type: "text",
        label: "Link text (used when shown as a link)",
      },
    },
    defaultProps: {
      file: null,
      displayAs: "auto",
      alt: "",
      linkText: "",
    },
    render: FileEmbedRender,
  };
}
