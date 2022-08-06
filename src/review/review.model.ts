import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export class ReviewModel extends TimeStamps implements Base {
	_id: Types.ObjectId;

	get id(): string {
		console.log(this._id);
		return this._id.toString();
	}

	@prop()
	name: string;

	@prop()
	title: string;

	@prop()
	description: string;

	@prop()
	rating: number;

	@prop()
	productId: Types.ObjectId; //?
}
