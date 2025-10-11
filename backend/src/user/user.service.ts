import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { BCRYPT_SALT_ROUNDS } from "src/config/bcypts";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}
    
    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async createUser(user: User) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_SALT_ROUNDS)
        user.password = hashedPassword

        return this.prisma.user.
        create({
            data: user
        })
    }
}