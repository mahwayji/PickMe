import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const {userId} = request.user;

        const user = await this.userService.getUserByID(userId);

        if (user && user.isAdmin) {
            return true;    
        } else {
            throw new UnauthorizedException("Access denied. Admins only.");
        }  
    }
}
    