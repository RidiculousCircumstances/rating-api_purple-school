import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { PageController } from './page.controller';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Module({
	controllers: [PageController],
	providers: [ConfigService, PageService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PageModel,
				schemaOptions: {
					collection: 'Page',
				},
			},
		]),
	],
	exports: [PageService],
})
export class PageModule {}
