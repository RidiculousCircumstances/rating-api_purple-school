import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private telegramService: TelegramService,
	) {}
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewService.create(dto);
	}

	@Post('notify')
	async notufy(@Body() dto: CreateReviewDto): Promise<void> {
		const message =
			`Имя ${dto.name}\n` +
			`Заголовок ${dto.title}\n` +
			`Описание ${dto.description}\n` +
			`Рейтинг ${dto.rating}\n` +
			`ID Продукта ${dto.productId}\n`;
		return this.telegramService.sendMessage(message);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	): Promise<DocumentType<ReviewModel>[]> {
		const a = await this.reviewService.getByProductId(productId);
		return await this.reviewService.getByProductId(productId);
	}
}
