import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreatePageDto } from './dto/create-page.dto';
import { PageModel, TopCategory } from './page.model';
import { addDays } from 'date-fns';
import { Types } from 'mongoose';

@Injectable()
export class PageService {
	constructor(@InjectModel(PageModel) private readonly pageModel: ModelType<PageModel>) {}

	async create(dto: CreatePageDto): Promise<PageModel> {
		return this.pageModel.create(dto);
	}

	async findById(id: string): Promise<PageModel | null> {
		return this.pageModel.findById(id).exec();
	}

	async findByAlias(alias: string): Promise<PageModel[] | null> {
		return await this.pageModel.find({ alias }).exec();
	}

	async deleteById(id: string): Promise<PageModel | null> {
		return this.pageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string | Types.ObjectId, dto: CreatePageDto): Promise<PageModel | null> {
		return this.pageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findByCategory(firstLevelCategory: TopCategory): Promise<PageModel[] | null> {
		return this.pageModel
			.aggregate()
			.match({
				firstLevelCategory,
			})
			.group({
				_id: { secondLevelCategory: '$secondLevelCategory' },
				pages: { $push: { alias: '$alias', title: '$title', _id: '$_id', category: '$category' } },
			})
			.exec();
	}

	// async findByCategory(firstLevelCategory: TopCategory): Promise<PageModel[] | null> {
	// 	return this.pageModel
	// 		.aggregate([
	// 			{ $match: { firstLevelCategory } },
	// 			{
	// 				$group: {
	// 					_id: { secondLevelCategory: '$secondLevelCategory' },
	// 					pages: {
	// 						$push: { alias: '$alias', title: '$title', _id: '$_id', category: '$category' },
	// 					},
	// 				},
	// 			},
	// 		])
	// 		.exec();
	// }

	async findByText(text: string): Promise<PageModel[] | null> {
		return this.pageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
	}

	async findForHHUpdate(date: Date): Promise<PageModel[] | null> {
		return this.pageModel
			.find({
				firstLevelCategory: 0,
				$or: [
					{ 'hh.updatedAt': { $lt: addDays(date, -1) } },
					{ 'hh.updatedAt': { $exists: false } }, //берем либо документы с апдейтом более дня назад, либо без апдейта вообще
				],
			})
			.exec();
	}
}
