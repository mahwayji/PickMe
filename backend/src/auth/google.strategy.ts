import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/api/v2/auth/google/callback',
            scope: ['email', 'profile'],
            accessType: 'offline',
            prompt: 'consent',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {  
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            profilePicture: photos[0].value,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
        };
        done(null, user);
        console.log('Google profile:', profile);
    }
}