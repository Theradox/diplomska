import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';

@Module({
  providers: [LedgerService],
  controllers: [],
  exports: [LedgerService]
})
export class LedgerModule {}

