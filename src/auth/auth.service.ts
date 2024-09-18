import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    @Inject()
    private readonly userService: UserService;

    @Inject()
    private readonly jwtService: JwtService;

    async signin(params: Prisma.UserCreateInput): Promise<{ access_token: string }> {
        const user = await this.userService.user({ email: params.email })
        if (!user) throw new UnauthorizedException("Email e/ou senha incorreta!")

        const passwordMatch = await bcrypt.compare(params.password, user.password)
        if (!passwordMatch) throw new UnauthorizedException("Email e/ou senha incorreta!")

        const payload = { sub: user.id }

        return { access_token: await this.jwtService.signAsync(payload) }
    }
} 
