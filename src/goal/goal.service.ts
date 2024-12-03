import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalService {
  @Inject()
  private readonly prismaService: PrismaService;

  async create(createGoalDto: CreateGoalDto, req: any) {
    return this.prismaService.goal.create({
      data: { ...createGoalDto, userId: req.sub.sub },
    });
  }

  async findGoals(req: any) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goalsCreatedUpToWeek = await this.prismaService.goal.findMany({
      where: {
        userId: req.sub.sub,
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
      orderBy: {
        id: 'asc',
      },
    });

    // Retornar mensagem se não houver metas cadastradas
    if (goalsCreatedUpToWeek.length === 0) {
      return { message: 'Nenhuma meta cadastrada.' };
    }

    const goalCompletionCounts =
      await this.prismaService.goalCompletion.groupBy({
        by: ['goalId'],
        where: {
          goal: {
            userId: req.sub.sub,
          },
          createdAt: {
            gte: firstDayOfWeek,
            lte: lastDayOfWeek,
          },
        },
        _count: {
          id: true,
        },
      });

    return goalsCreatedUpToWeek.map((goal) => {
      const completionCount =
        goalCompletionCounts.find((gc) => gc.goalId === goal.id)?._count.id ||
        0;
      return {
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        completionCount,
        completedAt: goal.createdAt,
      };
    });
  }

  async findPendingGoals(req: any) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goalsCreatedUpToWeek = await this.prismaService.goal.findMany({
      where: {
        userId: req.sub.sub,
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
      orderBy: {
        id: 'asc',
      },
    });

    const goalCompletionCounts =
      await this.prismaService.goalCompletion.groupBy({
        by: ['goalId'],
        where: {
          goal: {
            userId: req.sub.sub,
          },
          createdAt: {
            gte: firstDayOfWeek,
            lte: lastDayOfWeek,
          },
        },
        _count: {
          id: true,
        },
      });

    return goalsCreatedUpToWeek.map((goal) => {
      const completionCount =
        goalCompletionCounts.find((gc) => gc.goalId === goal.id)?._count.id ||
        0;
      return {
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        completionCount,
      };
    });
  }
}
