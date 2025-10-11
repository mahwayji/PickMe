import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Post()
    async createUser(@Body() user: User){
        return this.userService.createUser(user)
    }
}