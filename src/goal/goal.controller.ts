import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalService } from './goal.service';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(createGoalDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findGoals() {
    return this.goalService.findGoals();
  }

  @UseGuards(AuthGuard)
  @Get('pending')
  findPendingGoals() {
    return this.goalService.findPendingGoals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
