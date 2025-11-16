import { Body, Controller, Get, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}

    @Get(':username')
    async getProfileByUsername(@Param('username') username: string ){
        return await this.profileService.getUserProfileByUsername(username)
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('profileImage'))
    async updateUserProfile(
        @Param('id') id: string, 
        @Body() body: ProfileDto,
        @UploadedFile() file: Express.Multer.File, 
){
        return await this.profileService.updateUserProfile(id, body, file);
    }
}
