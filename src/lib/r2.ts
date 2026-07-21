import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 is S3-compatible. `R2_ENDPOINT` is the account-level endpoint
 * (no bucket path); the bucket is supplied per-request via `R2_BUCKET_NAME`.
 */
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/** Upload a buffer to R2 under `key` and return its public URL. */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
  metadata?: Record<string, string>,
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    }),
  );
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
