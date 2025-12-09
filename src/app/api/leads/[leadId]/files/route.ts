import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { leadId: string } }) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Dosya zorunlu" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "public", "uploads", params.leadId);
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;
  const diskPath = path.join(uploadsDir, fileName);
  await fs.writeFile(diskPath, buffer);

  const publicPath = `/uploads/${params.leadId}/${fileName}`;
  await prisma.leadFile.create({
    data: {
      leadId: params.leadId,
      fileName: file.name,
      filePath: publicPath,
      fileSize: buffer.byteLength,
      mimeType: file.type
    }
  });

  return NextResponse.redirect(new URL(`/leads/${params.leadId}`, request.url));
}
