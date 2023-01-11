import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {AuthModule} from "../auth/auth.module";
import {LedgerModule} from "../ledger/ledger.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  AuthModule,
  LedgerModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
