import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	const configService: ConfigService = app.get(ConfigService);
	const port = configService.get('PORT') as number;
	await app.listen(port);
}
bootstrap();
