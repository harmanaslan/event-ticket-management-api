import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsAdvancedDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name: 'isAdvancedDate',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown) {
            if (!value) {
              return false;
            }

            if (typeof value !== 'string') {
              return false;
            }
  
            const eventDate = new Date(value);
            const now = new Date();
  
            if (Number.isNaN(eventDate.getTime())) {
              return false;
            }
  
            const minimumDate = new Date();
            minimumDate.setDate(now.getDate() + 3);
  
            return eventDate >= minimumDate;
          },
  
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be at least 3 days after today`;
          },
        },
      });
    };
  }