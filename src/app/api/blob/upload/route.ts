import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files?.length) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

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
      { status: 500 }
    );
  }
}
