import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "src/auth/admin.guard";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(':username')
    @UseGuards(AuthGuard('jwt'))
    async getUserByUsername(@Param('username') username: string){
        return await this.userService.getUserByUsername(username);
    }
    @Post()
    async createUser(@Body() user: User){
        return this.userService.createUser(user)
    }
}