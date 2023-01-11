import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import {LedgerModule} from "../ledger/ledger.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [AdministratorService],
  controllers: [AdministratorController],
  imports: [LedgerModule, AuthModule]
})
export class AdministratorModule {}
