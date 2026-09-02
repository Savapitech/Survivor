import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'minAge', async: false })
class MinAgeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;
    const birthDate = new Date(value);
    if (Number.isNaN(birthDate.getTime())) return false;

    const [minAge] = args.constraints as [number];
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;

    return age >= minAge;
  }

  defaultMessage(args: ValidationArguments): string {
    const [minAge] = args.constraints as [number];
    return `Vous devez avoir au moins ${minAge} ans pour vous inscrire.`;
  }
}

export function MinAge(minAge: number, options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'minAge',
      target: object.constructor,
      propertyName,
      options,
      constraints: [minAge],
      validator: MinAgeConstraint,
    });
  };
}
