import { Module } from "@nestjs/common";
import { SectionController } from "src/section/section.controller";
import { SectionService } from "src/section/section.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";
import { MediaService } from "src/media/media.service";

@Module({
    imports: [AuthModule],
    controllers: [SectionController],
    providers: [SectionService, PrismaService, MediaService],
    exports: [SectionService],
})
export class SectionModule {}