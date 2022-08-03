import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserDto } from './dto/user.dto';
import { UserModel } from './user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { NON_EXISTEN_USER_ERROR, WRONG_PASSWORD_ERROR, WRONG_USER_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser(dto: UserDto): Promise<UserModel> {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			hashedPassword: await hash(dto.password, salt),
		});
		return newUser.save();
	}

	async findUser(email: string): Promise<UserModel | null> {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const foundUser = await this.findUser(email);
		if (!foundUser) {
			throw new UnauthorizedException(NON_EXISTEN_USER_ERROR);
		}
		const isCorrectPassword = await compare(password, foundUser.hashedPassword);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: foundUser.email };
	}

	async login(email: string): Promise<{ access_token: string }> {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}

	async deleteUser(id: string, email: string): Promise<DocumentType<UserModel> | null> {
		const existedUser = await this.userModel.findById(id.slice(1));
		if (!existedUser) {
			throw new NotFoundException(NON_EXISTEN_USER_ERROR);
		}
		if (email != existedUser.email) {
			throw new ForbiddenException(WRONG_USER_ERROR);
		}
		return existedUser.delete();
	}
}
