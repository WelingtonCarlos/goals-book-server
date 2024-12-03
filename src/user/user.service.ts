import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const hashPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashPassword },
    });
  }

  async user(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    req: any;
  }): Promise<User> {
    const { where, data, req } = params;
    const userId = req.sub.sub;

    const userToUpdate = await this.prisma.user.findUnique({
      where,
    });

    if (!userToUpdate || userToUpdate.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este usuário.',
      );
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password.toString(), 10);
    }

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(params: {
    where: Prisma.UserWhereUniqueInput;
    req: any;
  }): Promise<User> {
    const { where, req } = params;
    const userId = req.sub.sub;

    const userDelete = await this.prisma.user.findUnique({
      where,
    });

    if (!userDelete || userDelete.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este usuário.',
      );
    }

    return this.prisma.user.delete({
      where,
    });
  }
}
