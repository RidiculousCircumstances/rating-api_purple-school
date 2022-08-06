import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TopCategory } from '../page.model';

export class HHDataDto {
	@IsNumber()
	count: number;

	@IsNumber()
	juniorSalary: number;

	@IsNumber()
	middleSalary: number;

	@IsNumber()
	seniorSalary: number;
}

export class TopPageAdvantageDataDto {
	@IsString()
	title: string;

	@IsString()
	description: string;
}

export class CreatePageDto {
	@IsEnum(TopCategory)
	firstLevelCategory: TopCategory;

	@IsString()
	secondLevelCategory: string;

	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	category: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => HHDataDto)
	hh?: HHDataDto;

	@IsArray()
	@ValidateNested()
	@Type(() => TopPageAdvantageDataDto)
	advantages: TopPageAdvantageDataDto[];

	@IsString()
	seoText: string;

	@IsString()
	tegsTitle: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
