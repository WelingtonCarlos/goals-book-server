import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service'; // Certifique-se de que PrismaService está configurado corretamente
import { CreateCompletionDto } from './dto/create-completion.dto';

@Injectable()
export class CompletionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCompletionDto: CreateCompletionDto, req: any) {
    const goalId = Number(createCompletionDto.goalId);
    const userId = req.sub.sub;

    if (isNaN(goalId)) {
      throw new BadRequestException('ID da meta inválido');
    }

    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
      select: { userId: true, desiredWeeklyFrequency: true },
    });

    if (!goal) {
      throw new BadRequestException('Meta não encontrada');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para completar esta meta');
    }

    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    // Contar o número de conclusões da meta para a semana atual
    const goalCompletionCounts = await this.prisma.goalCompletion.aggregate({
      _count: {
        id: true,
      },
      where: {
        goalId,
        createdAt: {
          gte: firstDayOfWeek,
          lte: lastDayOfWeek,
        },
      },
    });

    const completionCount = goalCompletionCounts._count.id || 0;

    // Verificar se a meta já foi concluída na frequência desejada
    if (completionCount >= goal.desiredWeeklyFrequency) {
      throw new BadRequestException('Esta meta já foi concluída!');
    }

    // Inserir uma nova conclusão de meta
    const goalCompletion = await this.prisma.goalCompletion.create({
      data: {
        goalId,
        userId
      },
    });

    return { goalCompletion };
  }

  async remove(id: number, req: any) {

    const userId = req.sub.sub;

    const completion = await this.prisma.goalCompletion.findUnique({
      where: { id },
      select: { goal: { select: { userId: true } } },
    });

    if (!completion) {
      throw new BadRequestException('Conclusão de meta não encontrada');
    }

    if (completion.goal.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover esta conclusão');
    }

    // Remover a conclusão de meta
    await this.prisma.goalCompletion.delete({
      where: { id },
    });

    return { message: 'Conclusão desfeita com sucesso' };
  }

}

