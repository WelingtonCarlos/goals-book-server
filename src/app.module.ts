import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { CompletionModule } from './completion/completion.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, GoalModule, CompletionModule, SummaryModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
