import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BCRYPT_SALT_ROUNDS } from "src/config/bcypts";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async createUser(user: User) {
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

    async getUserByEmail(email: string) {
        const result = await this.prisma.user.findUnique({ 
            where: { email } 
        });

        if (!result) {
            throw new NotFoundException('User not found');
        }

        return result;
    }
}