import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { NON_VALID_ID } from './id-validation.constants';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata): any {
		if (metadata.type != 'param') {
			return value;
		}
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(NON_VALID_ID);
		}
		return value;
	}
}
