import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';
import { UserDto } from '../src/auth/dto/user.dto';
import * as request from 'supertest';

describe('Auth Controller (e2e)', () => {
	let app: INestApplication;
	let userId: string;
	let accessToken: string;

	const registerDto: UserDto = {
		login: 'bb2a@ya.ru',
		password: 'aaaaaaaaa',
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('Create User - success', async () => {
		const req = request(app.getHttpServer()).post('/auth/register').send(registerDto);
		await req.expect(201);
		userId = (await req).body._id;
	});

	it('Create User - failure: bad request', async () => {
		const req = request(app.getHttpServer()).post('/auth/register').send(registerDto);
		await req.expect(400);
	});

	it('Login User - success', async () => {
		const req = request(app.getHttpServer()).post('/auth/login').send(registerDto);
		await req.expect(200);
		accessToken = (await req).body.access_token;
	});

	it('Login User - failure', async () => {
		const req = request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...registerDto, password: 'bbbbbbbb' });
		await req.expect(401);
	});

	it('Delete User - success', async () => {
		const req = request(app.getHttpServer())
			.delete('/auth/:' + userId)
			.set('Authorization', 'Bearer ' + accessToken);
		await req.expect(200);
	});

	it('Delete User - failure', async () => {
		const req = request(app.getHttpServer())
			.delete('/auth/:' + userId)
			.set('Authorization', 'Bearer ' + accessToken);
		await req.expect(404);
	});

	afterAll(async () => {
		disconnect();
	});
});
