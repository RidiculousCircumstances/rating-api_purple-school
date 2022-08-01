import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export class ReviewModel extends TimeStamps implements Base {
	_id: Types.ObjectId;
	id: string;

	@prop()
	name: string;

	@prop()
	title: string;

	@prop()
	descriptopn: string;

	@prop()
	rating: string;

	@prop()
	productId: Types.ObjectId;
}
