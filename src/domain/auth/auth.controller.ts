import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject() private readonly authService: AuthService
    ) { }

    @Post('signup')
    signup(@Body() createAdminDto: CreateAdminDto) {
        const userCreated = this.authService.signup(createAdminDto);
        return userCreated
    }

    @Post('signin')
    signin(@Body() authDto: AuthDto) {
        const userAuthenticated = this.authService.signin(authDto);
        return userAuthenticated
    }
}
