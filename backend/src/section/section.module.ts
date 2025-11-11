import { Module } from "@nestjs/common";
import { SectionController } from "src/section/section.controller";
import { SectionService } from "src/section/section.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [SectionController],
    providers: [SectionService, PrismaService],
    exports: [SectionService],
})
export class SectionModule {}