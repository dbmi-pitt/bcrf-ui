"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Link as LinkIcon, File as FileIcon } from "lucide-react";



const styles = {
  chooseButton: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "8px 0",
    fontSize: 14,
    color: "#4b5563",
    background: "white",
    cursor: "pointer",
  },
  previewRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: 8,
  },
  thumb: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 4,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbSmall: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: 4,
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  linkButton: {
    fontSize: 12,
    color: "#2563eb",
    background: "none",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  },
  iconButton: {
    color: "#9ca3af",
    background: "none",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    display: "flex",
    padding: 0,
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100000,
  },
  modal: {
    background: "white",
    borderRadius: 8,
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: 420,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f3f4f6",
    padding: "12px 16px",
  },
  tabRow: {
    display: "flex",
    gap: 16,
    fontSize: 14,
  },
  tabButton: (active) => ({
    fontWeight: active ? 600 : 400,
    color: active ? "#111827" : "#9ca3af",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  }),
  closeButton: {
    color: "#9ca3af",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
  },
  searchBarWrap: {
    padding: 12,
    borderBottom: "1px solid #f3f4f6",
  },
  searchInputWrap: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: 10,
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: "6px 12px 6px 30px",
    fontSize: 14,
    boxSizing: "border-box",
  },
  resultsWrap: {
    overflowY: "auto",
    flex: 1,
    padding: 8,
  },
  centeredNote: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    padding: "24px 0",
  },
  centeredError: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    padding: "24px 0",
  },
  resultRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 8,
    borderRadius: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  resultPath: {
    flex: 1,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  linkTabWrap: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  linkLabel: {
    display: "block",
    fontSize: 14,
    color: "#4b5563",
  },
  linkInputRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  linkInput: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 14,
    boxSizing: "border-box",
  },
  useButton: (disabled) => ({
    width: "100%",
    background: "#111827",
    color: "white",
    fontSize: 14,
    border: "none",
    borderRadius: 6,
    padding: "8px 0",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  }),
  code: {
    fontSize: 12,
    background: "#f3f4f6",
    padding: "1px 4px",
    borderRadius: 4,
  },
};





/**
 * Extracts a virtual path from whatever someone might paste: a full page
 * URL, an absolute path, or just the bare path. Doesn't trust any of it —
 * this is purely for convenience; the actual GET ?path= lookup on the
 * server re-validates and re-normalizes it the same way uploads do, so a
 * garbage or malicious paste just resolves to "not found", never to an
 * unvalidated path.
 *
 * @param {string} input
 * @param {string} sourceId
 */
function extractCandidatePath(input, sourceId) {
  let value = input.trim();
  const marker = `/sources/${sourceId}/about/files/`;
  const idx = value.indexOf(marker);
  if (idx !== -1) {
    value = value.slice(idx + marker.length);
  }
  value = value.split("?")[0].split("#")[0];
  value = value.replace(/^\/+/, "");
  return value;
}

/**
 * @param {{ sourceId: string, value: { id: string, path: string, mimeType: string, url: string } | null, onChange: (value: any) => void }} props
 */
export default function FilePickerField({ sourceId, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {value ? (
        <SelectedFilePreview file={value} onClear={() => onChange(null)} onChangeClick={() => setIsOpen(true)} />
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={styles.chooseButton}
          className="w-full border border-gray-300 rounded-md py-2 text-sm text-gray-600 hover:border-gray-400"
        >
          Choose a file…
        </button>
      )}

      {isOpen && (
        <FilePickerModal
          sourceId={sourceId}
          onClose={() => setIsOpen(false)}
          onSelect={(file) => {
            onChange(file);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SelectedFilePreview({ file, onClear, onChangeClick }) {
  const isImage = typeof file.mimeType === "string" && file.mimeType.startsWith("image/");
  const fileName = file.path.split("/").pop();

  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2" style={styles.previewRow}>
      <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-50 flex items-center justify-center overflow-hidden" style={styles.thumb}>
        {isImage ? (
          <img src={file.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <FileIcon size={16} className="text-gray-400" />
        )}
      </div>
      <span className="flex-1 text-sm truncate" title={file.path} style={styles.fileName}>
        {fileName}
      </span>
      <button
        type="button"
        onClick={onChangeClick}
        className="text-xs text-blue-600 hover:underline flex-shrink-0"
        style={styles.linkButton}
      >
        Change
      </button>
      <button
        type="button"
        onClick={onClear}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="Remove file"
        style={styles.iconButton}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function FilePickerModal({ sourceId, onClose, onSelect }) {
  const [tab, setTab] = useState("browse"); // "browse" | "link"
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
      style={styles.backdrop}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3" style={styles.modalHeader}>
          <div className="flex gap-4 text-sm" style={styles.tabRow}>
            <button
              type="button"
              onClick={() => setTab("browse")}
              className={tab === "browse" ? "font-medium text-gray-900" : "text-gray-400"}
              style={styles.tabButton(tab==="broswe")}
            >
              Browse files
            </button>
            <button
              type="button"
              onClick={() => setTab("link")}
              className={tab === "link" ? "font-medium text-gray-900" : "text-gray-400"}
              style={styles.tabButton(tab==="link")}
            >
              Paste a link
            </button>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" style={styles.closeButton}>
            <X size={18} />
          </button>
        </div>

        {tab === "browse" ? (
          <BrowseTab sourceId={sourceId} onSelect={onSelect} />
        ) : (
          <LinkTab sourceId={sourceId} onSelect={onSelect} />
        )}
      </div>
    </div>,
    document.body
  );
}

function BrowseTab({ sourceId, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/sources/${sourceId}/files?q=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        const data = await res.json();
        setResults(data.files || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [sourceId, query]);

  return (
    <div className="flex flex-col min-h-0 flex-1" style={{display:"flex", flexDirection:"column",minHeight:0, flex:1}}>
      <div className="p-3 border-b border-gray-100" style={styles.searchBarWrap}>
        <div className="relative" style={styles.searchInputWrap}>
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" style={styles.searchIcon}/>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name…"
            className="w-full border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-sm"
            style={styles.searchInput}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-2" style={styles.resultsWrap}>
        {loading && <p className="text-sm text-gray-400 text-center py-6" style={styles.centeredNote}>Searching…</p>}
        {error && <p className="text-sm text-red-500 text-center py-6" style={styles.centeredError}>{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6" style={styles.centeredNote}>No files found</p>
        )}
        {!loading &&
          !error &&
          results.map((file) => {
            const isImage = typeof file.mimeType === "string" && file.mimeType.startsWith("image/");
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => onSelect(file)}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 text-left"
                style={styles.resultRow}
              >
                <div className="w-9 h-9 flex-shrink-0 rounded bg-gray-50 flex items-center justify-center overflow-hidden" style={styles.thumbSmall}>
                  {isImage ? (
                    <img src={file.url} alt="" className="w-full h-full object-cover" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  ) : (
                    <FileIcon size={15} className="text-gray-400" color="#9ca31f"/>
                  )}
                </div>
                <span className="flex-1 text-sm truncate" style={styles.resultPath}>{file.path}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

function LinkTab({ sourceId, onSelect }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState(null);

  const handleUse = async () => {
    const candidatePath = extractCandidatePath(input, sourceId);
    if (!candidatePath) return;

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(`/api/sources/${sourceId}/files?path=${encodeURIComponent(candidatePath)}`);
      if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
      const data = await res.json();
      if (!data.file) {
        setStatus("error");
        setError("No file exists at that path");
        return;
      }
      onSelect(data.file);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="p-4 space-y-3" style={styles.linkTabWrap}>
      <label className="block text-sm text-gray-600" style={styles.linkLabel}>
        Paste a link to an existing uploaded file, or just its path (e.g.{" "}
        <code className="text-xs bg-gray-100 px-1 rounded" style={styles.code}>images/team-photo.png</code>):
      </label>
      <div className="flex items-center gap-2" style={styles.linkInputRow}>
        <LinkIcon size={14} className="text-gray-400 flex-shrink-0" style={{flexShrink:0}}/>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUse()}
          placeholder="/sources/.../about/files/images/team-photo.png"
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
          style={styles.linkInput}
        />
      </div>
      {status === "error" && <p className="text-sm text-red-500" style={{fontSize:14,color:"#ef4444",margin:0}}>{error}</p>}
      <button
        type="button"
        onClick={handleUse}
        disabled={!input.trim() || status === "loading"}
        className="w-full bg-gray-900 text-white text-sm rounded-md py-2 disabled:opacity-40"
        style={styles.useButton(!input.trim()||status==="loading")}
      >
        {status === "loading" ? "Checking…" : "Use this file"}
      </button>
    </div>
  );
}
