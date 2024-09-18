import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule { }
