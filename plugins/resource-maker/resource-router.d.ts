import { HttpResponse, RequestEvent } from '../../deps.ts';
import { ResourceController } from './resource-controller.ts';


export interface IResourceAction<T, TF> {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path?: string;
  handler?: IResourceActionFunction<T, TF>;
}


export interface IResourceActionContext<T, TF> {
  action: IResourceAction<T, TF>;
  requestEvent: RequestEvent;
  request: Request;
  response: HttpResponse;
  controller: ResourceController<T, TF>
  // deno-lint-ignore no-explicit-any
  params: Record<string, any>;
  query: Record<string, unknown>;
  headers: Record<string, string>;
}


// deno-lint-ignore no-explicit-any
export type IResourceActionFunction<T, TF> = (context: IResourceActionContext<T, TF>) => any | Promise<any>
export type IResourceActionMultiFunction<T, TF> = IResourceActionFunction<T, TF> | IResourceActionFunction<T, TF>[] | Record<string, IResourceActionFunction<T, TF>>


export type IResourceWare<T, TF> = (context: IResourceActionContext<T, TF>) => void | Promise<void>;
