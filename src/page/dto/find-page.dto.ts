import { UsePipes, ValidationPipe } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { TopCategory } from '../page.model';

export class FindPageDto {
	@IsEnum(TopCategory)
	firstLevelCategory: TopCategory;
}
