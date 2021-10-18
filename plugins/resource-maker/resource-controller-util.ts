import { IResourceProperties, IResourceProperty } from './resource-model.d.ts';


function validateElement<T, TF>(element: unknown, key: string, property: IResourceProperty, partial = false) {
  if (property.type === 'boolean') {
    if (typeof element !== 'boolean') {
      throw new Error(`${key} is not boolean`);
    }
  }
  else if (property.type === 'number') {
    if (typeof element !== 'number') {
      throw new Error(`${key} is not number`);
    }
  }
  else if (property.type === 'string') {
    if (typeof element !== 'string') {
      throw new Error(`${key} is not string`);
    }
  }
  else if (property.type === 'object') {
    if (typeof element !== 'object' || Array.isArray(element) || element == null) {
      throw new Error(`${key} is not object`);
    }
  }
  else if (property.type === 'series') {
    if (typeof element !== 'object' || !Array.isArray(element)) {
      throw new Error(`${key} is not a series`);
    }

    for (const index in element as Array<unknown>) {
      validateDocument((element as Array<unknown>)[index] as Record<keyof T, TF>, property.seriesSchema!, partial)
    }

  }
}

export function validateDocument<T, TF>(document: Record<keyof T, unknown>, properties: IResourceProperties<T, TF>, partial = false): void {

  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('document is not an object');
  }

  for (const key in properties) {
    if (!( key in document ) && partial) continue;

    const property = properties[key as keyof T];
    if (!( key in document ) && property.required) throw new Error(`${key} does not exist in document`);
    if (!( key in document )) continue;

    if (property.array) {
      if (!Array.isArray(document[key])) {
        throw new Error(`${key} is not an array`);
      }

      for (const index in document[key] as Array<unknown>) {
        validateElement((document[key] as Array<unknown>)[index], `${key}.${index}`, property, partial);
      }

    }
    else {
      validateElement(document[key], key, property);
    }

  }

}
