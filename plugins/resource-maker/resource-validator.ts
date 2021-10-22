import { IResourceBase, IResourceProperties } from './resource-model.d.ts';
import { HandleableError } from '../error/handleable-error.ts';
import { validateElement } from './resource-validator-util.ts';


type IResourceValidationFunction<T, TF> = (it: T) => boolean | string | Promise<boolean | string>;

export type IResourceValidation<T, TF> = {
  [property in keyof T]?: IResourceValidationFunction<T, TF>[];
}

export class ResourceValidationError extends HandleableError {
  public code = 1200;
  public httpStatus = 400;
}


export class ResourceValidator<T, TF extends IResourceBase> {

  constructor(private name: string, private properties: IResourceProperties<T, TF>) {
    this.initializeWithProperties();
  }

  private initializeWithProperties() {
    for (const key in this.properties) {
      const property = this.properties[key];

      this.addValidations({
        // deno-lint-ignore no-explicit-any
        [key as any]: [
          (it: T) => {
            validateElement(it[key], property, key);
            return true;
          }
        ]
      });

    }
  }


  private validations: IResourceValidation<T, TF> = {};

  public addValidations(validations: IResourceValidation<T, TF>) {
    for (const property in validations) {
      if (property in this.validations) {
        this.validations[property] = [
          ...this.validations[property as keyof T]!,
          ...validations[property as keyof T]!
        ];
      }
      else {
        this.validations[property] = validations[property];
      }
    }
  }

  public async validate(document: T) {

    const errors: { property: string, error: string }[] = [];
    const frozenDocument = Object.freeze(document) as T;

    for (const property in this.validations) {
      for (const validator of this.validations[property]! || []) {
        try {

          const validationResult = await validator(frozenDocument);
          if (validationResult !== false && typeof validationResult !== 'string') continue;

          errors.push({
            property,
            error: typeof validationResult === 'string' ? validationResult : `${property} is incorrect`
          });
          break;

        }
        catch (error: unknown) {

          errors.push({
            property,
            // deno-lint-ignore no-explicit-any
            error: (error as any).responseMessage || (error as any).message || String(error)
          });
          break;

        }
      }
    }

    if (errors.length === 0) return;

    throw new ResourceValidationError(
      `${this.name} validation errors: ${errors.map(it => it.error).join(' - ')}`,
      'There was a problem in your request data.',
      {},
      {
        validations: errors
      }
    );

  }

}
