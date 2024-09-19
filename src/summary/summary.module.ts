import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule { }
