import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User} from "../user/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(user: User): Promise<any> {
        const validatedUser = await this.authService.validateUser(user);
        if (!validatedUser) {
            throw new UnauthorizedException();
        }
        return validatedUser;
    }
}
