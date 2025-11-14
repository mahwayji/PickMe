import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BCRYPT_SALT_ROUNDS } from "src/config/bcypts";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { NotFoundException } from "@nestjs/common";
import { success } from "zod";
import { find } from "rxjs";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async createUser(user: User) {
        if(await this.prisma.user.findUnique({where: {username: user.username}}))
            throw new Error('The username has already been used')
    
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS)
        user.password = hashedPassword

        return await this.prisma.user.
        create({
            data: user
        })
    }

    async getUserByID(id: string) {
        const result = await this.prisma.user.findUnique({ 
            where: { id } 
        });
        
        if (!result) {
            throw new NotFoundException('User not found');
        }

        return result;
    }

    async getUserByUsername(username: string) {
        const result = await this.prisma.user.findUnique({ 
            where: { username: username } 
        });
    
        if (!result) {
            throw new NotFoundException('User not found');
        }

        return result;
    }

    async getUserByEmail(email: string) {
        const result = await this.prisma.user.findUnique({ 
            where: { email: email } 
        });

        if (!result) {
            throw new NotFoundException('User not found');
        }

        return result;
    }

    async updateUser(id: string, body: User){
        if (!await this.prisma.user.findUnique({where: {id: id}}))
                throw new NotFoundException("User not found");
            
        const user = await this.prisma.user.findUnique({where: {username: body.username}});
        if(user?.id !== id) 
                throw new Error("The username has already been used")

        await this.prisma.user.update({
            where: {id: id},
            data: body,
        })
    
    }
}