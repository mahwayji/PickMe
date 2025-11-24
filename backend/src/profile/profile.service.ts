import { Injectable, NotFoundException } from '@nestjs/common';
import { Visibility } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mediaService: MediaService
    ){}

    async getUserProfileByUsername(username: string){
        const user = await this.prisma.user.findUnique({where: {username:username}});

        if(!user)
            throw new NotFoundException("User with this username doesn't exist.")

        const profile = await this.prisma.profile.findUnique({where: {userId: user.id}})

        const result =  {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            profileMediaId: profile?.profileMediaId,
            description: profile?.description,
            location: profile?.location,
            visibility: profile?.visibility
        }

        return result
    }

    async updateUserProfile(id:string, body: ProfileDto, file: Express.Multer.File){
        const user = await this.prisma.user.findUnique({where: {id: id}})
        if(!user)
            throw new NotFoundException("User not found")

        // update user
        const newUser = await this.prisma.user.update({
            where: {id:id},
            data: {
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
            }
        })

        // update profile
        const newProfile = await this.prisma.profile.update({
            where: {userId: newUser.id},
            data: {
                description: body.description,
                location: body.location,
                visibility: body.visibility
            }
        })

        if(file){
            this.updateImage(newUser.id, file)
            if(newProfile?.profileMediaId) await this.mediaService.deleteImage(newProfile.profileMediaId)
        }
        return this.getUserProfileByUsername(newUser.username)
    }

    private async updateImage(id: string, profileImage: Express.Multer.File ){
        const media = await this.mediaService.uploadImage(id, profileImage)
        
        if(!media){
            throw new Error("Can't update profile")
        }
        
        await this.prisma.profile.update({
            where: {userId: id},
            data: {
                profileMediaId: media.id
            }
        })
    }
}
