import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { UserDto } from 'src/auth/dto/user.dto';

const productId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
	name: 'TestName',
	title: 'TestTitle',
	description: 'Lorem Ipsum',
	rating: 5,
	productId,
};
const registerDto: UserDto = {
	login: 'b9a@ya.ru',
	password: 'aaaaaaaaa',
};

describe('Review Controller (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let userId: string;
	let accessToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const registerResponse = await request(app.getHttpServer())
			.post('/auth/register')
			.send(registerDto);
		userId = registerResponse.body._id;
		const loginResponse = await request(app.getHttpServer()).post('/auth/login').send(registerDto);
		accessToken = loginResponse.body.access_token;
	});

	it('/review/create (POST) - success', async () => {
		const req = request(app.getHttpServer()).post('/review/create').send(testDto);
		req.expect(201);
		const resp = await req;
		createdId = resp.body._id;
		expect(createdId).toBeDefined();
	});

	it('/review/create (POST) - failure', async () => {
		const req = request(app.getHttpServer())
			.post('/review/create')
			.send({ ...testDto, rating: 0 });
		await req.expect(400);
	});

	it('/byProduct/:productId (GET) - success', async () => {
		const req = request(app.getHttpServer()).get('/review/byProduct/:' + productId);
		await req.expect(200);
		const resp = await req;
		expect(resp.body.length).toBe(1);
	});

	it('/byProduct/:productId (GET) - failure', async () => {
		const req = request(app.getHttpServer()).get(
			'/review/byProduct/:' + new Types.ObjectId().toHexString(),
		);
		await req.expect(200);
		const resp = await req;
		expect(resp.body.length).toBe(0);
	});

	it('/review/:id (DELETE) - success', async () => {
		const req = request(app.getHttpServer())
			.delete('/review/:' + createdId)
			.set('Authorization', 'Bearer ' + accessToken);
		await req.expect(200);
	});

	it('/review/:id (DELETE) - failure', async () => {
		const req = request(app.getHttpServer())
			.delete('/review/:' + new Types.ObjectId().toHexString())
			.set('Authorization', 'Bearer ' + accessToken);
		await req.expect(404);
	});

	afterAll(async () => {
		await request(app.getHttpServer())
			.delete('/auth/:' + userId)
			.set('Authorization', 'Bearer ' + accessToken);
		disconnect();
	});
});
