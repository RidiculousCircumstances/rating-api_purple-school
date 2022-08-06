import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { PageModel } from './page.model';

@Injectable()
export class PageService {
	constructor(@InjectModel(PageModel) private readonly pageModel: ModelType<PageModel>) {}

	async create(dto: CreatePageDto): Promise<PageModel> {
		return this.pageModel.create(dto);
	}

	async getById(id: string): Promise<PageModel | null> {
		return this.pageModel.findById(id).exec();
	}

	async getByAlias(alias: string): Promise<PageModel | null> {
		return await this.pageModel.findOne({ alias }).exec();
	}

	async deleteById(id: string): Promise<PageModel | null> {
		return this.pageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreatePageDto): Promise<PageModel | null> {
		return this.pageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async getByCategory(firstCategory: FindPageDto): Promise<PageModel[] | null> {
		return this.pageModel
			.find({ firstCategory }, { alias: 1, secondLevelCategory: 1, title: 1 })
			.exec();
	}
}
