import { Module } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { RetailerController } from './retailer.controller';
import { LedgerModule } from '../ledger/ledger.module';
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [RetailerService],
  controllers: [RetailerController],
  imports: [LedgerModule, AuthModule]
})
export class RetailerModule {}
