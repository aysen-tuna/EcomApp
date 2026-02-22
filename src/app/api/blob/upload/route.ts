import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Uploads disabled for demo" },
      { status: 403 },
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 },
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 },
        );
      }

      const blob = await put(`products/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });

      urls.push(blob.url);
    }

    return NextResponse.json({ urls }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Upload error" },
      { status: 500 },
    );
  }
}
