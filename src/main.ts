import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	const configService: ConfigService = app.get(ConfigService);

	app.enableCors({ origin: configService.get('ORIGIN') });
	const port = +configService.get('PORT');
	await app.listen(port);
}

bootstrap();
