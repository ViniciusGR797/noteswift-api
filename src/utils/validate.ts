import { registerDecorator, ValidationOptions, ValidationArguments, isDefined } from 'class-validator';
import { ObjectId } from 'mongodb';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
            return typeof value === 'string' && ObjectId.isValid(value) && isDefined(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `O campo ${args.property} deve ser um ObjectId válido`;
        },
      },
    });
  };
}
