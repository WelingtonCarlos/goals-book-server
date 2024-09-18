import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('sign-up')
    async signupUser(
        @Body() userData: Prisma.UserCreateInput,
    ): Promise<User> {
        return this.userService.createUser(userData);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUsers(@Param('id') id: string): Promise<User> {
        return this.userService.user({ id: Number(id) });
    }

    @UseGuards(AuthGuard)
    @Get()
    async getUser(): Promise<User[]> {
        return this.userService.users({
            where: {},
            orderBy: { createdAt: 'asc' }
        });
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateUser(
        @Body() userData: Prisma.UserUpdateInput,
        @Param('id') id: string
    ): Promise<User> {
        return this.userService.updateUser({
            where: { id: Number(id) },
            data: userData
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(
        @Param('id') id: string
    ): Promise<User> {
        return this.userService.deleteUser({ id: Number(id) })
    }

}
