import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SummaryService {
  @Inject()
  private readonly prisma: PrismaService

  async summary(req: any) {
    const lastDayOfWeek = dayjs().endOf('week').toDate();
    const firstDayOfWeek = dayjs().startOf('week').toDate();

    // Metas criadas até o final da semana
    const goalsCreatedUpToWeek = await this.prisma.goal.findMany({
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
    });

    // Metas concluídas durante a semana
    const goalsCompletedInWeek = await this.prisma.goalCompletion.findMany({
      where: {
        userId: req.sub.sub,
        createdAt: {
          gte: firstDayOfWeek,
          lte: lastDayOfWeek,
        },
      },
      select: {
        id: true,
        goal: {
          select: {
            title: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Agrupar metas concluídas por dia
    const goalsPerDay = goalsCompletedInWeek.reduce((acc, goalCompletion) => {
      const completedAtDate = dayjs(goalCompletion.createdAt).format('DD-MM-YYYY');
      if (!acc[completedAtDate]) {
        acc[completedAtDate] = [];
      }
      acc[completedAtDate].push({
        id: goalCompletion.id,
        title: goalCompletion.goal.title,
        completedAt: goalCompletion.createdAt,
      });
      return acc;
    }, {} as Record<string, { id: number; title: string; completedAt: Date }[]>);

    // Contagem de metas concluídas
    const completed = goalsCompletedInWeek.length;

    // Soma das frequências desejadas das metas criadas até a semana
    const total = goalsCreatedUpToWeek.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency,
      0,
    );

    return {
      summary: {
        completed,
        total,
        goalsPerDay,
      },
    };
  }
}
