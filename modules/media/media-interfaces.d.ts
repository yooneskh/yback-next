import { IResourceBase } from '../../plugins/resource-maker/resource-model.d.ts';


export interface IMediaBase {
  owner?: string;
  name: string;
  extension: string;
  size: number;
  type?: string;
  relativePath: string;
  path: string;
} export interface IMedia extends IMediaBase, IResourceBase {}
