import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { deleteFile, uploadFile } from 'src/utils/aws';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

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

        const videoMetadata = await this.getVideoMetadata(file);

        const media = await this.prisma.media.create({
            data: {
            fileName: uploaded.fileName,
            url: uploaded.url,
            ownerId: id,
            type: mediaType,
            ...(mediaType === 'video' && {
                    width: videoMetadata?.width,
                    height: videoMetadata?.height,
                })
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

    private getVideoMetadata(file: Express.Multer.File): Promise<{ width: number; height: number; duration: number }> {
        return new Promise((resolve, reject) => {
        // ffmpeg cannot read buffers directly, so write a temp file
        const tmpPath = `/tmp/${Date.now()}-${file.originalname}`;
        import('fs').then(fs => {
            fs.writeFileSync(tmpPath, file.buffer);
            ffmpeg.ffprobe(tmpPath, (err, metadata) => {
            fs.unlinkSync(tmpPath); // clean up temp file
            if (err) return reject(err);
            const stream = metadata.streams.find(s => s.width && s.height);
            resolve({
                width: stream?.width ?? 0,
                height: stream?.height ?? 0,
                duration: metadata.format.duration ?? 0,
            });
            });
        });
        });
    }

}
