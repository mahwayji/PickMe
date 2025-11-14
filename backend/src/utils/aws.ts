import { S3 } from 'aws-sdk'

export async function uploadFile(file: Express.Multer.File) {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
    });

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `images/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const { Key, Location } = await s3.upload(params).promise();
    return { fileName: Key, url: Location };
}
