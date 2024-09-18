import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    signin(@Body() body: Prisma.UserCreateInput) {
        return this.authService.signin(body);
    }

}
