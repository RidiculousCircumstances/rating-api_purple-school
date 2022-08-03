import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

class Leak {}

const leaks = [];

@Injectable()
export class ReviewService {
	constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		const res = this.reviewModel.create(dto);
		return res;
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		const res = this.reviewModel.findByIdAndDelete(id.slice(1)).exec();
		return res;
	}

	async getByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		leaks.push(new Leak());
		return this.reviewModel.find({ productId: new Types.ObjectId(productId.slice(1)) }).exec();
	}

	async deleteByProductId(productId: string): Promise<
		{
			ok?: number | undefined;
			n?: number | undefined;
		} & { deletedCount?: number | undefined }
	> {
		return this.reviewModel
			.deleteMany({ productId: new Types.ObjectId(productId.slice(1)) })
			.exec();
	}
}
