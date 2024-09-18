import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { CompletionModule } from './completion/completion.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, GoalModule, CompletionModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
