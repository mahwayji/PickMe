import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
});

export async function uploadFile(file: Express.Multer.File) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `images/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    return {
        fileName: params.Key,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
    };
}

export async function deleteFile(key: string) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
    };

    await s3.send(new DeleteObjectCommand(params));

    return { success: true };
}
