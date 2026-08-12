import { NextResponse } from "next/server";
import { getUserSourcePerms, userCanView } from "@/lib/assetmanager/auth";
import { normalizeVirtualPath } from "@/lib/assetmanager/path-utils";
import { findFileByPath, findSource } from "@/lib/assetmanager/files";
import { getObjectBuffer } from "@/lib/assetmanager/storage";

/**
 * @param {Request} req
 * @param {{ params: { sourceId: string, filepath: string[] } }} context
 */
export async function GET(req, { params }) {
  const {dataSource, filepath} = await params;
  const source = await findSource(dataSource);
  if (!source) {
    console.log("!source", source, dataSource)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // The [...filepath] segments are re-joined and re-validated here — this
  // is the only place they're ever used, and only as a database lookup
  // key. They are never concatenated onto a real filesystem/storage path.
  const virtualPath = normalizeVirtualPath((filepath ?? []).join("/"));
  if (!virtualPath) {
    console.log("!virtualPath")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const record = await findFileByPath(dataSource, virtualPath);
  if (!record) {
    console.log("!record")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!record.is_public) {
    console.log("!record.is_public")
    const usp = await getUserSourcePerms(req);
    if (!usp || !userCanView(usp, record)) {
      // 404 rather than 403 to avoid confirming the existence of private
      // files to unauthorized viewers.
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  let buffer;
  try {
    buffer = await getObjectBuffer(record.storage_key);
  } catch {
    console.log("buffer issue")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": record.mime_type,
      "Content-Disposition": `inline; filename="${encodeURIComponent(record.original_name)}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
      // Stops browsers from re-sniffing/re-interpreting content as
      // something more dangerous than the declared, verified type.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
