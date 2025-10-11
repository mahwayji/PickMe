import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DEFAULT_JWT_SECRET } from "src/config/jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: DEFAULT_JWT_SECRET, // Can change in future to env variable
        });
    }

    async validate(payload: any) {
        return { userId: payload.id, email: payload.email };
    }
}