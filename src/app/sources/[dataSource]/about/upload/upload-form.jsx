"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, File as FileIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { asyncPool } from "@/lib/assetmanager/async-pool";

// How many uploads run at once. Raise/lower this single number to change
// how much concurrency the form uses — see lib/async-pool.js for why a
// cap (rather than "all at once") is the right default.
const MAX_CONCURRENT_UPLOADS = 4;

/**
 * Uploads a single file via XHR (not fetch) specifically so we can report
 * upload progress — fetch has no upload-progress event as of this
 * writing. Talks to the existing, unmodified POST /api/sources/:id/files
 * route: one file per request, same as before.
 *
 * @param {string} sourceId
 * @param {File} file
 * @param {(percent: number) => void} onProgress
 */
function uploadFile(sourceId, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", file.name);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(null);
        }
      } else {
        let message = `Upload failed (${xhr.status})`;
        try {
          const body = JSON.parse(xhr.responseText);
          if (body?.error) message = body.error;
        } catch {
          // ignore parse failure, use default message
        }
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("POST", `/api/sources/${sourceId}/files`);
    xhr.send(formData);
  });
}

/**
 * @param {{ sourceId: string }} props
 */
export default function UploadForm({ sourceId }) {
  const [items, setItems] = useState([]); // { id, file, progress, status, error }
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const idCounter = useRef(0);

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const startUploads = useCallback(
    (newItems) => {
      // This is the "multiple simultaneous uploads" part: instead of
      // awaiting each upload before starting the next, asyncPool fires up
      // to MAX_CONCURRENT_UPLOADS requests at once.
      asyncPool(MAX_CONCURRENT_UPLOADS, newItems, async (item) => {
        updateItem(item.id, { status: "uploading" });
        try {
          await uploadFile(sourceId, item.file, (progress) => updateItem(item.id, { progress }));
          updateItem(item.id, { status: "done", progress: 100 });
        } catch (err) {
          updateItem(item.id, { status: "error", error: err.message, progress: 0 });
        }
      });
    },
    [sourceId, updateItem]
  );

  const addFiles = useCallback(
    (fileList) => {
      const newItems = Array.from(fileList).map((file) => ({
        id: ++idCounter.current,
        file,
        progress: 0,
        status: "pending", // pending | uploading | done | error
        error: null,
      }));
      if (newItems.length === 0) return;
      setItems((prev) => [...prev, ...newItems]);
      startUploads(newItems);
    },
    [startUploads]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onPick = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file again later
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <UploadCloud className="mx-auto mb-3 text-gray-400" size={36} />
        <p className="text-sm text-gray-600">
          Drag and drop files here, or <span className="text-blue-600 underline">browse</span>
        </p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={onPick} />
      </div>

      {items.length > 0 && (
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 text-sm border rounded-md p-3">
              <FileIcon size={18} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.file.name}</p>
                {item.status === "uploading" && (
                  <div className="w-full h-1.5 bg-gray-100 rounded mt-1 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && <p className="text-red-500 mt-1">{item.error}</p>}
              </div>
              {item.status === "uploading" && (
                <Loader2 size={16} className="animate-spin text-gray-400 flex-shrink-0" />
              )}
              {item.status === "done" && (
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              )}
              {item.status === "error" && (
                <XCircle size={16} className="text-red-500 flex-shrink-0" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
