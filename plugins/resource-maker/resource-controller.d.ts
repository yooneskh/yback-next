// deno-lint-ignore-file no-explicit-any


export interface IResourceControllerPopulates {
  [keyPath: string]: string
}

export interface IResourceControllerContext<T, TF> {
  filters?: any;
  selects?: string[];
  skip?: number;
  limit?: number;
  sorts?: any;
  populates?: IResourceControllerPopulates;
  resourceId?: string;
  document?: T;
  payload?: Partial<T>;
}
