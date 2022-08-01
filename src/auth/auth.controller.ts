import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	@HttpCode(201)
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<void> {}

	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto): Promise<void> {}
}
