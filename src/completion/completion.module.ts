import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { CompletionController } from './completion.controller';
import { CompletionService } from './completion.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CompletionController],
  providers: [CompletionService],
})
export class CompletionModule {}
