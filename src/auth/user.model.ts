import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export class UserModel extends TimeStamps implements Base {
	_id: Types.ObjectId;
	id: string;

	@prop({ unique: true })
	email: string;

	@prop()
	hashedPassword: string;
}
