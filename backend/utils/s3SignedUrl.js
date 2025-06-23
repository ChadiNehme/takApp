import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client.js"; // your configured v3 S3 client

export const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: "attachment; filename=CV.docx"
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 }); // 5 minutes
  return url;
};
