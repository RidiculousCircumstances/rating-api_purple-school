import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {
	@IsString()
	@IsEmail()
	login: string;

	@IsString()
	@IsDefined()
	@MinLength(8)
	password: string;
}
