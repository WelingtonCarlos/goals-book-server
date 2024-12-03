import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalService } from './goal.service';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGoalDto: CreateGoalDto, @Request() req: any) {
    return this.goalService.create(createGoalDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findGoals(@Request() req: any) {
    return this.goalService.findGoals(req);
  }

  @UseGuards(AuthGuard)
  @Get('pending')
  findPendingGoals(@Request() req: any) {
    return this.goalService.findPendingGoals(req);
  }
}
