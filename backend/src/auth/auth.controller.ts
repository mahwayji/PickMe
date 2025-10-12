import { Body, Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { SignUpDto } from "./dto/signup.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        console.log('con run');
        return await this.authService.signUp(signUpDto);
    }

    @Post('signin')
    async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async me(@Request() req) {
        return await this.authService.me(req.user.userId);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Request() req,@Res() res) {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Request() req,@Res() res) {
        try {
            const result = await this.authService.googleLogin(req, res);
            const redirectUri = 'http://localhost:3000/sign-in';
            const redirectUrl = `${redirectUri}?sucess=${true}&email=${result.user.email}&token=${result.access_token}`;
            console.error('Going back', redirectUri);
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            const redirectUri = 'http://localhost:3000/sign-in';
            const redirectUrl = `${redirectUri}?sucess=${false}`;
            return res.redirect(redirectUrl);
        }

        // return this.authService.googleLogin(req);
        }
}