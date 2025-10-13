import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { randomUUID } from 'crypto';
import { ideahub } from "googleapis/build/src/apis/ideahub";

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
            else if(password === '' && user) {
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

    async validateGoogleUser(email: string): Promise<any> {
        try{
            console.log('Trying to find or create user with email:', email);
            const user = await this.userService.getUserByEmail(email);
            console.log('User found:', user);
            if (user) {
                const { password, ...result } = user;
                return result;
            }
        }
        catch (error){
            if (error instanceof NotFoundException) {
                // Not found is OK – means this is a new Google user
                console.log('No user found with email, will create new one:', email);
                return null;
            } else {
                console.error('Unexpected error in validateGoogleUser:', error);
                throw new UnauthorizedException('Error validating Google user');
        }
    }
    }

    async googleLogin(req, res) {
        console.log('googleLogin called');
        console.log('req.user:', req.user);

        if (!req.user) {
            console.error('No user from Google');
            throw new UnauthorizedException('No user from Google');
        }

        try {
            const data = await this.validateGoogleUser(req.user.email);

            let user;

            if (data) {
                // Existing user
                user = data;
                console.log('Existing user found:', user);
                } else {
                // New user — create one
                user = await this.userService.createUser({
                    username: randomUUID(), //For testing purpose, will change later
                    email: req.user.email,
                    firstName: '',
                    lastName: '',
                    password: '',
                    isAdmin: false,
                });
                console.log('Create User successfully, Need signUp?:',data ? false : true,);
                }

            const payload = {
                id: user.id,
                email: user.email,
            };
            
            const token = this.jwtService.sign(payload, { expiresIn: '7d' });

            return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: false,
            },
            access_token: token,
            };
        } catch (error) {
            console.error('Google login failed:', error);
            throw new UnauthorizedException('Google login failed');
        }
    }
}
        

