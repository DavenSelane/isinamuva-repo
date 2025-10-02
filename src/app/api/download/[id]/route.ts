// File: src/app/api/announcements/[id]/route.ts

export const dynamic = "force-dynamic"; // Ensure runtime execution

import { NextRequest, NextResponse } from "next/server";
import { DB } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = parseInt(params.id);

    // Fetch announcement/content from database
    const content = await DB.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const fileUrl = content.documentUrl || content.videoUrl || content.imageUrl;

    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL found" }, { status: 404 });
    }

    // Handle local files
    if (fileUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", fileUrl);
      try {
        const fileBuffer = await readFile(filePath);

        // Determine MIME type
        let contentType = "application/octet-stream";
        if (fileUrl.endsWith(".pdf")) contentType = "application/pdf";
        else if (fileUrl.endsWith(".mp4")) contentType = "video/mp4";
        else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg"))
          contentType = "image/jpeg";
        else if (fileUrl.endsWith(".png")) contentType = "image/png";
        else if (fileUrl.endsWith(".doc") || fileUrl.endsWith(".docx"))
          contentType = "application/msword";

        const ext = path.extname(fileUrl);
        const filename = `${content.title.replace(/[^a-z0-9]/gi, "_")}${ext}`;

        return new NextResponse(new Uint8Array(fileBuffer), {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch (fileError) {
        console.error("File read error:", fileError);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    }

    // Handle external URLs (Cloudinary, S3, etc.)
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch external file" },
        { status: response.status }
      );
    }

    const blob = await response.arrayBuffer();

    // Determine MIME type
    let contentType = "application/octet-stream";
    if (fileUrl.endsWith(".pdf")) contentType = "application/pdf";
    else if (fileUrl.endsWith(".mp4")) contentType = "video/mp4";
    else if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg"))
      contentType = "image/jpeg";
    else if (fileUrl.endsWith(".png")) contentType = "image/png";

    const filename = `${content.title.replace(/[^a-z0-9]/gi, "_")}${path.extname(fileUrl) || ".pdf"}`;

    return new NextResponse(new Uint8Array(blob), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
