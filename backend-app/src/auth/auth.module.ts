import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./jwt/jwt.strategy";
import {User} from "../user/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LedgerModule} from "../ledger/ledger.module";

@Module({
  imports: [
    PassportModule,
    LedgerModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
