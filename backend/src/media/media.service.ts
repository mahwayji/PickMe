import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { deleteFile, uploadFile } from 'src/utils/aws';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';

(ffmpeg as any).setFfmpegPath((ffmpegInstaller as any).path);
@Injectable()
export class MediaService {
    constructor(private readonly prisma:PrismaService) {}

    async uploadImage(id: string, file: Express.Multer.File) {
        if (!file) {
            throw new Error("File is missing. Ensure you're using @UseInterceptors(FileInterceptor('file')).");
        }
        if (!file.originalname) {
            throw new Error("File has no originalname. Check Multer config.");
        }

        const ext = file.originalname.split('.').pop()?.toLowerCase();
        let mediaType: 'image' | 'video';

        if (/(png|jpg|jpeg|webp|gif)$/.test(ext!)) {
            mediaType = 'image';
        } else if (/(mp4|webm|mov)$/.test(ext!)) {
            mediaType = 'video';
        } else {
            throw new Error('Invalid file type! Only image or video allowed.');
        }

        const uploaded = await uploadFile(file);
        if (!uploaded) throw new Error("Can't upload file.");

        let videoMetadata: { width: number; height: number; duration: number } | null = null;
        if (mediaType === 'video') {
            videoMetadata = await this.getVideoMetadata(file);
        }

        const existing = await this.prisma.media.findUnique({
        where: { url: uploaded.url },
        });

        if (existing) {
            return existing;
        }

        const media = await this.prisma.media.create({
            data: {
            fileName: uploaded.fileName,
            url: uploaded.url,
            ownerId: id,
            type: mediaType,
            ...(mediaType === 'video' && videoMetadata && {
                width: videoMetadata.width,
                height: videoMetadata.height,
            }),
            },
        });

        return media;
    }

    async getUrlById(id: string){
        const media = await this.prisma.media.findUnique({where: {id:id}})

        if(!media)
            throw new NotFoundException("The media with this id does not exist")

        return media.url
    }

    async deleteImage(id: string){
        const media = await this.prisma.media.findUnique({where: {id:id}})
        if(!media)
            throw new NotFoundException("The media with this id does not exist")

        deleteFile(media.fileName)
        
        await this.prisma.media.deleteMany({where: {id: id}})
    }

    private getVideoMetadata( file: Express.Multer.File): Promise<{ width: number; height: number; duration: number }> {
        return new Promise((resolve, reject) => {
            const baseTmp = tmpdir();
            const tempDir = path.join(baseTmp, 'pickme-video-metadata');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const safeName = file.originalname.replace(/[^\w.-]/g, '_');
            const tmpPath = path.join(tempDir, `${Date.now()}-${safeName}`);

            try {
                fs.writeFileSync(tmpPath, file.buffer);

                (ffmpeg as any).ffprobe(tmpPath, (err: any, metadata: any) => {
                    try {
                        fs.unlinkSync(tmpPath);
                    } catch {
                    }

                    if (err) {
                        console.error('[getVideoMetadata] ffprobe error', err);
                        return resolve({ width: 0, height: 0, duration: 0 });
                    }

                    const stream = (metadata?.streams || []).find(
                        (s: any) => s.width && s.height
                    );

                    resolve({
                        width: stream?.width ?? 0,
                        height: stream?.height ?? 0,
                        duration: metadata?.format?.duration ?? 0,
                    });
                });
            } catch (e) {
            try {
                fs.unlinkSync(tmpPath);
            } catch {
            }
            console.error('[getVideoMetadata] failed before ffprobe', e);
            return resolve({ width: 0, height: 0, duration: 0 });
            }
        });
    }
}
