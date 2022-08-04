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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ReviewModel } from 'src/review/review.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto): Promise<void> {
		this.productService.create(dto);
	}

	@Get(':id')
	async get(@Param('id') id: string): Promise<ProductModel> {
		const result = await this.productService.getById(id.slice(1));
		if (!result) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}
		return result;
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {
		const result = await this.productService.deleteById(id.slice(1));
		if (!result) {
			throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
		}
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: ProductModel): Promise<ProductModel> {
		const result = await this.productService.updateById(id.slice(1), dto);
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
