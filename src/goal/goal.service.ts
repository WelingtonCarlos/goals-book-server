import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {

  @Inject()
  private readonly prismaService: PrismaService;

  create(createGoalDto: CreateGoalDto) {
    const userId = 1; // Assumindo que o userId vem de algum lugar fixo, substitua conforme necessário.
    return this.prismaService.goal.create({
      data: { ...createGoalDto, userId }
    });
  }

  async findGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goalsCreatedUpToWeek = await this.prismaService.goal.findMany({
      where: {
        createdAt: {
          lte: lastDayOfWeek,
        },
      },
      select: {
        id: true,
        title: true,
        desiredWeeklyFrequency: true,
        createdAt: true,
      },
    });

    const goalCompletionCounts = await this.prismaService.goalCompletion.groupBy({
      by: ['goalId'],
      where: {
        createdAt: {
          gte: firstDayOfWeek,
          lte: lastDayOfWeek,
        },
      },
      _count: {
        id: true,
      },
    });

    return goalsCreatedUpToWeek.map(goal => {
      const completionCount = goalCompletionCounts.find(gc => gc.goalId === goal.id)?._count.id || 0;
      return {
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        completionCount,
        completedAt: goal.createdAt,
      };
    });
  }

  async findPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goalsCreatedUpToWeek = await this.prismaService.goal.findMany({
      where: {
        createdAt: {
          lte: lastDayOfWeek,
        },
      },
      select: {
        id: true,
        title: true,
        desiredWeeklyFrequency: true,
        createdAt: true,
      },
    });

    const goalCompletionCounts = await this.prismaService.goalCompletion.groupBy({
      by: ['goalId'],
      where: {
        createdAt: {
          gte: firstDayOfWeek,
          lte: lastDayOfWeek,
        },
      },
      _count: {
        id: true,
      },
    });

    return goalsCreatedUpToWeek.map(goal => {
      const completionCount = goalCompletionCounts.find(gc => gc.goalId === goal.id)?._count.id || 0;
      return {
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        completionCount,
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
