import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors({ origin: 'http://83.246.208.128:3000/' });
	const configService: ConfigService = app.get(ConfigService);
	const port = +configService.get('PORT');
	await app.listen(port);
}

bootstrap();
