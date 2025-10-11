import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        try{
            const user = await this.userService.getUserByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (user && isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }
            else {
                throw new UnauthorizedException('Incorrect email or password');
            }
        }

        catch{

            throw new UnauthorizedException('Incorrect email or password');
        }
    }

    async signIn(signInDto: SignInDto): Promise<any> {
        const {id,username,email,isAdmin} = await this.validateUser(signInDto.email, signInDto.password);
        const payload = { email: email, id: id };

        return {
            access_token: this.jwtService.sign(payload),
            user: {id,username,email,isAdmin}
        };
    }

    async me(userId: string) {
        const userdata = await this.userService.getUserByID(userId);

        return {
            id: userdata.id,
            username: userdata.username,
            email: userdata.email,
            firstname: userdata.firstName,
            lastname: userdata.lastName,
            profilePicture: userdata.profilePicture,
            isAdmin: userdata.isAdmin
        }
    }

    async signUp(signUpDto: SignUpDto) {
        console.log('service run');
        return await this.userService.createUser({
            username: randomUUID(), //For testing purpose, will change later
            email: signUpDto.email,
            password: signUpDto.password,
            firstName: '',
            lastName: '',   
            isAdmin: false
        });
    }
}