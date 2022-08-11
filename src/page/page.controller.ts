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
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { NON_EXISTING_PAGE_ERROR } from './page.constants';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
	constructor(private readonly pageService: PageService) {}
	@Post('create')
	async create(@Body() dto: CreatePageDto): Promise<PageModel> {
		return this.pageService.create(dto);
	}

	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string): Promise<PageModel> {
		const result = await this.pageService.getById(id);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@Get('/byAlias/:alias')
	async getByAlias(@Param('alias') alias: string): Promise<PageModel> {
		const result = await this.pageService.getByAlias(alias);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<PageModel | null> {
		const result = await this.pageService.deleteById(id);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreatePageDto,
	): Promise<PageModel | null> {
		const result = await this.pageService.updateById(id, dto);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('findByCategory')
	async find(@Body() dto: FindPageDto): Promise<PageModel[]> {
		const result = await this.pageService.getByCategory(dto);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}
}
