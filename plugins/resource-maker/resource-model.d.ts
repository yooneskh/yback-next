// deno-lint-ignore-file no-explicit-any

export interface IResourceBase {
  _id: any;
  createdAt: number;
  updatedAt: number;
}

export interface IResourceProperty {
  type: 'string' | 'number' | 'boolean';
  ref?: string;
  required?: boolean;
  default?: any;
  enum?: any[];
  // meta
  title?: string;
  titleable?: boolean;
}

export type IResourceProperties<T, TF> = {
  [key in keyof T] -?: IResourceProperty;
}
