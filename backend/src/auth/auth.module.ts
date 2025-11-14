import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { DEFAULT_JWT_SECRET, JWT_EXPIRATION_TIME } from "src/config/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GoogleStrategy } from "./google.strategy";

@Module({
    imports: [
        JwtModule.register({
            secret: DEFAULT_JWT_SECRET, // Can change in future to env variable
            signOptions: { expiresIn: JWT_EXPIRATION_TIME },    
        }),

    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, PrismaService, UserService, GoogleStrategy],
    
})
export class AuthModule {}