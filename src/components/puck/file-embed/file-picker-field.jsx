"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Link as LinkIcon, File as FileIcon } from "lucide-react";

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
    <div className="flex items-center gap-2 border border-gray-200 rounded-md p-2">
      <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={file.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <FileIcon size={16} className="text-gray-400" />
        )}
      </div>
      <span className="flex-1 text-sm truncate" title={file.path}>
        {fileName}
      </span>
      <button
        type="button"
        onClick={onChangeClick}
        className="text-xs text-blue-600 hover:underline flex-shrink-0"
      >
        Change
      </button>
      <button
        type="button"
        onClick={onClear}
        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        aria-label="Remove file"
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
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex gap-4 text-sm">
            <button
              type="button"
              onClick={() => setTab("browse")}
              className={tab === "browse" ? "font-medium text-gray-900" : "text-gray-400"}
            >
              Browse files
            </button>
            <button
              type="button"
              onClick={() => setTab("link")}
              className={tab === "link" ? "font-medium text-gray-900" : "text-gray-400"}
            >
              Paste a link
            </button>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
    <div className="flex flex-col min-h-0 flex-1">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files by name…"
            className="w-full border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        {loading && <p className="text-sm text-gray-400 text-center py-6">Searching…</p>}
        {error && <p className="text-sm text-red-500 text-center py-6">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No files found</p>
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
              >
                <div className="w-9 h-9 flex-shrink-0 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FileIcon size={15} className="text-gray-400" />
                  )}
                </div>
                <span className="flex-1 text-sm truncate">{file.path}</span>
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
    <div className="p-4 space-y-3">
      <label className="block text-sm text-gray-600">
        Paste a link to an existing uploaded file, or just its path (e.g.{" "}
        <code className="text-xs bg-gray-100 px-1 rounded">images/team-photo.png</code>):
      </label>
      <div className="flex items-center gap-2">
        <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUse()}
          placeholder="/sources/.../about/files/images/team-photo.png"
          className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleUse}
        disabled={!input.trim() || status === "loading"}
        className="w-full bg-gray-900 text-white text-sm rounded-md py-2 disabled:opacity-40"
      >
        {status === "loading" ? "Checking…" : "Use this file"}
      </button>
    </div>
  );
}
