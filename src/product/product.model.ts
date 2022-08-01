import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export class ProductCharacteristics {
	@prop()
	name: string;

	@prop()
	value: string;
}

export class ProductModel extends TimeStamps implements Base {
	_id: Types.ObjectId;
	id: string;

	@prop()
	image: string;

	@prop()
	title: string;

	@prop()
	price: number;

	@prop()
	oldPrice: number;

	@prop()
	credit: number;

	@prop()
	calculatedRating: number;

	@prop()
	descriptopn: string;

	@prop()
	advantages: string;

	@prop()
	disadvantages: string;

	@prop({ type: () => [String] })
	categories: string[];

	@prop({ type: () => [String] })
	tags: string[];

	@prop({ type: () => [ProductCharacteristics], _id: false })
	characteristics: ProductCharacteristics[];
}
