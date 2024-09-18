import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/database/prisma.service'; // Certifique-se de que PrismaService está configurado corretamente
import { CreateCompletionDto } from './dto/create-completion.dto';

@Injectable()
export class CompletionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCompletionDto: CreateCompletionDto) {
    const goalId = Number(createCompletionDto.goalId);

    if (isNaN(goalId)) {
      throw new BadRequestException('ID da meta inválido');
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

    // Buscar a meta e sua frequência desejada
    const goal = await this.prisma.goal.findUnique({
      where: {
        id: goalId,
      },
      select: {
        desiredWeeklyFrequency: true,
      },
    });

    if (!goal) {
      throw new BadRequestException('Meta não encontrada');
    }

    const completionCount = goalCompletionCounts._count.id || 0;

    // Verificar se a meta já foi concluída na frequência desejada
    if (completionCount >= goal.desiredWeeklyFrequency) {
      throw new BadRequestException('Esta meta já foi concluída!');
    }

    // Inserir uma nova conclusão de meta
    const goalCompletion = await this.prisma.goalCompletion.create({
      data: {
        goalId,
      },
    });

    return { goalCompletion };
  }

  // findAll() {
  //   return `This action returns all completion`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} completion`;
  // }

  // update(id: number, updateCompletionDto: UpdateCompletionDto) {
  //   return `This action updates a #${id} completion`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} completion`;
  // }
}
