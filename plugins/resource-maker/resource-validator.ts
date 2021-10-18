import { IResourceBase, IResourceProperties } from './resource-model.d.ts';
import { HandleableError } from '../error/handleable-error.ts';


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

      // deno-lint-ignore no-explicit-any
      const addValidation = (vf: (it: any) => boolean | string | Promise<boolean | string>) => this.addValidations({ [key as any]: [vf] });

      const required = property.required;
      const errorMessage = required ? `${property.title || key} is requried.` : `${property.title || key} is not ${property.type}`;

      if (property.type === 'boolean') {
        addValidation(it => it[key] === false || it[key] === true || (!(key in it) && !required) || errorMessage);
      }
      else if (property.type === 'number') {
        addValidation(it => it[key] >= 0 || it[key] <= 0 || (!(key in it) && !required) || errorMessage);
      }
      else if (property.type === 'string') {
        addValidation(it => typeof it[key] === 'string' && it[key] !== '' || (!(key in it) && !required) || (!required && it[key] === '') || errorMessage);
      }
      else if (property.type === 'object') {
        addValidation(it => typeof it[key] === 'object' && !Array.isArray(it[key]) && !!it[key] || (!(key in it) && !required) || errorMessage);
      }
      else if (property.type === 'series') {
        addValidation(it => typeof it[key] === 'object' && Array.isArray(it[key]) && it[key].length > 0 || (!(key in it) && !required) || errorMessage);
        // todo: validate inners with property.seriesSchema
      }

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

        const validationResult = await validator(frozenDocument);
        if (validationResult !== false && typeof validationResult !== 'string') continue;

        errors.push({
          property,
          error: typeof validationResult === 'string' ? validationResult : `${property} is incorrect`
        });

        break;

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
