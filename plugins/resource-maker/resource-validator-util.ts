import { IResourceProperties, IResourceProperty } from './resource-model.d.ts';


function validateElement<T, TF>(element: unknown, property: IResourceProperty, keyPath: string) {
  if (property.type === 'boolean') {
    if (typeof element !== 'boolean') {
      throw new Error(`${keyPath} is not boolean`);
    }
  }
  else if (property.type === 'number') {
    if (typeof element !== 'number') {
      throw new Error(`${keyPath} is not number`);
    }
  }
  else if (property.type === 'string') {
    if (typeof element !== 'string') {
      throw new Error(`${keyPath} is not string`);
    }
  }
  else if (property.type === 'object') {
    if (typeof element !== 'object' || Array.isArray(element) || element == null) {
      throw new Error(`${keyPath} is not object`);
    }
  }
  else if (property.type === 'series') {
    if (typeof element !== 'object' || !Array.isArray(element)) {
      throw new Error(`${keyPath} is not an array`);
    }

    for (const index in element as Array<unknown>) {
      validateDocument((element as Array<unknown>)[index] as Record<keyof T, TF>, property.seriesSchema!, `${keyPath}.${index}`);
    }

  }
  else {
    throw new Error(`${keyPath} validation is not defined.`);
  }
}

export function validateDocument<T, TF>(document: Record<keyof T, unknown>, properties: IResourceProperties<T, TF>, keyPath: string): void {

  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error(`${keyPath} is not an object`);
  }

  for (const key in properties) {

    const property = properties[key as keyof T];
    if (!( key in document ) && property.required) throw new Error(`${keyPath}.${key} does not exist in document`);
    if (!( key in document )) continue;

    if (property.array) {
      if (!Array.isArray(document[key])) {
        throw new Error(`${keyPath}.${key} is not an array`);
      }

      for (const index in document[key] as Array<unknown>) {
        validateElement((document[key] as Array<unknown>)[index], property, `${keyPath}.${key}.${index}`);
      }

    }
    else {
      validateElement(document[key], property, `${keyPath}.${key}`);
    }

  }

}
