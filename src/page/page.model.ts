import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export enum TopCategory {
	Courses,
	Services,
	Books,
	Products,
}

export class HhData {
	@prop()
	count: number;

	@prop()
	juniorSalary: number;

	@prop()
	middleSalary: number;

	@prop()
	seniorSalary: number;
}

export class TopPageAdvantageData {
	@prop()
	title: string;
	@prop()
	description: string;
}

export class PageModel extends TimeStamps implements Base {
	_id: Types.ObjectId;
	id: string;

	@prop({ enum: TopCategory })
	firstLevelCategory: TopCategory;

	@prop()
	secondLevelCategory: string;

	@prop()
	title: string;

	@prop({ unique: true })
	category: string;

	@prop({ type: () => HhData })
	hh?: HhData;

	@prop({ type: () => [TopPageAdvantageData] })
	advantages: TopPageAdvantageData[];

	@prop()
	seoText: string;

	@prop()
	tegsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
