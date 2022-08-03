import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ALREDY_EXISTS_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { UserModel } from './user.model';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(201)
	@Post('register')
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: UserDto): Promise<UserModel | null> {
		const oldUser = await this.authService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(ALREDY_EXISTS_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@HttpCode(200)
	@Post('login')
	@UsePipes(new ValidationPipe())
	async login(@Body() { login, password }: UserDto): Promise<{ access_token: string }> {
		const { email } = await this.authService.validateUser(login, password);
		return this.authService.login(email);
	}
}
