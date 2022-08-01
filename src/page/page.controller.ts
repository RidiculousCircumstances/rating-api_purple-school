import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindPageDto } from './dto/find-page.dto';
import { PageModel } from './page.model';

@Controller('page')
export class PageController {
	constructor(private readonly configService: ConfigService) {}
	@Post('create')
	async create(@Body() dto: Omit<PageModel, '_id'>): Promise<void> {}

	@Get(':id')
	async get(@Param('id') id: string): Promise<void> {}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<void> {}

	@Patch(':id')
	async patch(@Param('id') id: string, @Body() dto: PageModel): Promise<void> {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindPageDto): Promise<void> {}
}
