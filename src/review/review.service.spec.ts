import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
	let service: ReviewService;

	const exec = { exec: jest.fn() };
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const reviewRepositoryFactory = () => ({
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		find: () => exec,
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewService,
				{ useFactory: reviewRepositoryFactory, provide: getModelToken('ReviewModel') },
			],
		}).compile();

		service = module.get<ReviewService>(ReviewService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('getByProductId', async () => {
		const id = `:${new Types.ObjectId().toHexString()}`;
		reviewRepositoryFactory()
			.find()
			.exec.mockReturnValueOnce([{ productId: id }]);
		const res = await service.getByProductId(id);
		expect(res[0].productId).toBe(id);
	});
});
