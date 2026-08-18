"use server"
import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { getUserSourcePerms, userCanUploadTo } from "@/lib/assetmanager/auth";
import { normalizeVirtualPath } from "@/lib/assetmanager/path-utils";
import { findFileByPath, createFileRecord, searchFiles } from "@/lib/assetmanager/files";
import { putObject } from "@/lib/assetmanager/storage";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

// Allow-list, not deny-list. Add types deliberately, never subtract from a
// "blocked" list.
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf", "text/csv"]);

/**
 * @param {Request} req
 * @param {{ params: { sourceId: string } }} context
 */
export async function POST(req, { params }) {


  const {sourceId} = await params
  const usp = await getUserSourcePerms(sourceId);

  if (!usp || !userCanUploadTo(usp)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  // The uploader can optionally specify a "path" field (e.g.
  // "images/team-photo.png") to control folder placement; otherwise fall
  // back to the raw filename. Either way it goes through the same strict
  // validation before it's trusted for anything.
  const rawPath = formData.get("path") ?? file.name;
  const virtualPath = normalizeVirtualPath(rawPath);
  if (!virtualPath) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Never trust the client-supplied MIME type or file extension — sniff
  // the actual bytes and validate against an allow-list.
  const detected = await fileTypeFromBuffer(buffer);
  const detectedType = detected?.mime;
  if (!detectedType || !ALLOWED_TYPES.has(detectedType)) {
    return NextResponse.json({ error: "Unsupported or unverifiable file type" }, { status: 415 });
  }

  const existing = await findFileByPath(sourceId, virtualPath);
  if (existing) {
    return NextResponse.json({ error: "A file already exists at this path" }, { status: 409 });
  }

  // Storage key is always server-generated (uuid-based) — the virtual path
  // is only ever used as a database lookup key, never as a real path.
  const id = randomUUID();
  const storageKey = `sources/${sourceId}/${id}`;

  await putObject(storageKey, buffer);

  const checksum = createHash("sha256").update(buffer).digest("hex");

  const recordId = await createFileRecord({
    sourceId: sourceId,
    virtualPath,
    storageKey,
    originalName: virtualPath.split("/").pop() || file.name,
    mimeType: detectedType,
    size: buffer.length,
    checksum,
    uploadedBy: usp.id,
    isPublic: true, // wire this up to a real visibility control as needed
  });

  return NextResponse.json({
    id: recordId,
    path: virtualPath,
    url: `/sources/${sourceId}/about/files/${virtualPath}`,
  });
}




function toPickerShape(sourceId, record) {
  return {
    id: record.id,
    path: record.path,
    mimeType: record.mime_type,
    size: record.size,
    url: `/sources/${sourceId}/about/files/${record.path}`,
  };
}

/**
 * Backs the Puck file-picker component: either a fuzzy search
 * (?q=partial-name) or an exact resolve (?path=images/photo.png) used
 * when someone pastes a link rather than browsing.
 *
 * Gated behind the same permission as upload (not the per-file
 * is_public visibility check the download route uses) since this
 * endpoint enumerates files rather than serving one already-known file
 * — it's meant for the content-editor picker, not general visitors.
 *
 * @param {Request} req
 * @param {{ params: { sourceId: string } }} context
 */
export async function GET(req, { params }) {
  const {sourceId} = await params;
  const usp = await getUserSourcePerms(sourceId);
  if (!usp || !userCanUploadTo(usp)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const exactPath = searchParams.get("path");

  if (exactPath !== null) {
    const virtualPath = normalizeVirtualPath(exactPath);
    if (!virtualPath) {
      return NextResponse.json({ file: null });
    }
    const record = await findFileByPath(sourceId, virtualPath);
    return NextResponse.json({ file: record ? toPickerShape(sourceId, record) : null });
  }

  const q = searchParams.get("q") || "";
  const records = await searchFiles(sourceId, q, 50);
  return NextResponse.json({ files: records.map((r) => toPickerShape(sourceId, r)) });
}
