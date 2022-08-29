import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { HhModule } from '../hh/hh.module';
import { PageController } from './page.controller';
import { PageModel } from './page.model';
import { PageService } from './page.service';

@Module({
	controllers: [PageController],
	providers: [PageService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PageModel,
				schemaOptions: {
					collection: 'Page',
				},
			},
		]),
		HhModule,
	],
	exports: [PageService],
})
export class PageModule {}
