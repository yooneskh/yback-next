
export interface IResourceBase {
  // deno-lint-ignore no-explicit-any
  _id: any;
  createdAt: number;
  updatedAt: number;
}

export interface IResourceProperty {
  type: 'string' | 'number' | 'boolean';
  ref?: string;
  required?: boolean;
  // meta
  title?: string;
  titleble?: boolean;
}

export interface IResourceProperties {
  [key: string]: IResourceProperty
}
