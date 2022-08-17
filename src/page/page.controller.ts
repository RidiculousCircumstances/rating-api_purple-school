import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { HhService } from 'src/hh/hh.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { NON_EXISTING_DATA_ERROR, NON_EXISTING_PAGE_ERROR } from './page.constants';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Controller('page')
export class PageController {
	constructor(
		private readonly pageService: PageService,
		private readonly hhService: HhService,
		private readonly scheduleRgistry: SchedulerRegistry,
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreatePageDto): Promise<PageModel> {
		return this.pageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string): Promise<PageModel> {
		const result = await this.pageService.findById(id);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@Get('/byAlias/:alias')
	async getByAlias(@Param('alias') alias: string): Promise<PageModel> {
		const result = await this.pageService.findByAlias(alias);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<PageModel | null> {
		const result = await this.pageService.deleteById(id);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@UseGuards(JwtAuthGuard)
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
		const result = await this.pageService.findByCategory(dto.firstLevelCategory);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string): Promise<PageModel[]> {
		const result = await this.pageService.findByText(text);
		if (!result) {
			throw new NotFoundException(NON_EXISTING_PAGE_ERROR);
		}
		return result;
	}

	// @Cron('28 19 * * *')
	@Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'test' })
	async updateVacancies(): Promise<void> {
		const job = this.scheduleRgistry.getCronJob('test');
		const data = await this.pageService.findForHHUpdate(new Date());
		if (!data) {
			throw new NotFoundException(NON_EXISTING_DATA_ERROR);
		}
		for (const page of data) {
			const hhData = await this.hhService.getData(page.category);
			Logger.log(hhData);
			page.hh = hhData;
			await this.sleep();
			await this.pageService.updateById(page._id, page);
		}
	}

	private sleep(): Promise<void> {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res();
			}, 1000);
		});
	}
}
