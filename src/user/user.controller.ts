import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
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
    async getUser(@Param('id') id: string): Promise<User> {
        return this.userService.user({ id: Number(id) });
    }

    @UseGuards(AuthGuard)
    @Get()
    async getUsers(): Promise<User[]> {
        return this.userService.users({
            where: {},
            orderBy: { createdAt: 'asc' }
        });
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateUser(
        @Body() userData: Prisma.UserUpdateInput,
        @Param('id') id: string,
        @Request() req: any,
    ): Promise<User> {
        return this.userService.updateUser({
            where: { id: Number(id) },
            data: userData,
            req
        });
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(
        @Param('id') id: string,
        @Request() req: any,
    ): Promise<User> {
        return this.userService.deleteUser({ where: { id: Number(id) }, req })
    }

}
