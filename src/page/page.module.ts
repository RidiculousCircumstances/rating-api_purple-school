import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { PageController } from './page.controller';
import { PageModel } from './page.model';

@Module({
	controllers: [PageController],
	providers: [ConfigService],
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
})
export class PageModule {}
