import { Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService){}

    @Get(':id')
    async getUrlbyId(@Param('id') id: string){
        return await this.mediaService.getUrlbyId(id)
    }
}
