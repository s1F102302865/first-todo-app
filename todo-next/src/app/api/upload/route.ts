import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ファイルが存在しません" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME!;

    // S3（LocalStack）への書き込みコマンド準備
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    // 実行
    await s3Client.send(command);

    // アクセス用URLの生成
    const imageUrl = `${process.env.AWS_ENDPOINT_URL}/${bucketName}/${fileName}`;

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json({ error: "アップロード失敗" }, { status: 500 });
  }
}