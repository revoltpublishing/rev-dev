import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ObjectSchema } from "joi";

@Injectable()
export class PayloadValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new HttpException(
        error.details.map((val) => ({
          message: val.message,
        })),
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }
}
