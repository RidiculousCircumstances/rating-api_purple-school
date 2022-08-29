import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from '../telegram/telegram.interface';

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
	return {
		token: getBotToken(configService),
		chatId: getChatId(configService),
	};
};

const getBotToken = (configService: ConfigService): string => {
	const token = configService.get('TELEGRAM_TOKEN') as string;
	if (!token) {
		throw new Error('TELEGRAM_TOKEN не задан');
	}
	return configService.get('TELEGRAM_TOKEN') as string;
};

const getChatId = (configService: ConfigService): string => {
	return configService.get('chatId') ?? '';
};
