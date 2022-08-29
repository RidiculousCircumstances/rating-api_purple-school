import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ReviewModel } from '../review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto): Promise<ProductModel> {
		return this.productService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string): Promise<ProductModel> {
		const result = await this.productService.getById(id);
		if (!result) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}
		return result;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const result = await this.productService.deleteById(id);
		if (!result) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ProductModel,
	): Promise<ProductModel> {
		const result = await this.productService.updateById(id, dto);
		if (!result) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}
		return result;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto): Promise<
		(ProductModel & {
			productReview: ReviewModel[];
			reviewCount: number;
			ratingAvg: number;
		})[]
	> {
		return this.productService.findWithReviews(dto);
	}
}
