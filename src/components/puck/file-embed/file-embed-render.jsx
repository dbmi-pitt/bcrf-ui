/**
 * Renders a selected file as either an inline image or a download link.
 * Used as the Puck component's `render`, so it runs both live in the
 * editor preview and on the actually published page — same output either
 * way, no editor-only branching.
 *
 * @param {{
 *   file: { id: string, path: string, mimeType: string, url: string } | null,
 *   displayAs: "auto" | "image" | "link",
 *   alt: string,
 *   linkText: string,
 * }} props
 */
export function FileEmbedRender({ file, displayAs = "auto", alt, linkText }) {
  if (!file) {
    return (
      <div 
      style={{
          border: "1px dashed #d1d5db",
          borderRadius: 6,
          padding: "32px 16px",
          textAlign: "center",
          fontSize: 14,
          color: "#9ca3af",
        }}
      className="border border-dashed border-gray-300 rounded-md py-8 px-4 text-center text-sm text-gray-400">
        No file selected — choose one in the "File" field
      </div>
    );
  }

  const isImage = typeof file.mimeType === "string" && file.mimeType.startsWith("image/");
  const showAsImage = displayAs === "image" || (displayAs === "auto" && isImage);
  const fileName = file.path.split("/").pop();

  if (showAsImage) {
    // return <img src={file.url} alt={alt || fileName} className="max-w-full h-auto" style={{ maxWidth: "100%", height: "auto" }} />;
    return <img src={file.url} alt={alt || fileName} className="w-fixed"  />;
  }

  return (
    <a
      href={file.url}
      download
      className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "#2563eb",
        fontSize: 14,
        textDecoration: "underline",
      }}
    >
      {linkText || fileName}
    </a>
  );
}
