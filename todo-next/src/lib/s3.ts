import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
  endpoint: process.env.AWS_ENDPOINT_URL || "http://127.0.0.1:4566",
  forcePathStyle: true, // LocalStackを使う際に必須のフラグ
});