import { IResourceProperties } from './resource-model.d.ts';


export class ResourceMaker<T, TF> {

  public properties: IResourceProperties = {};


  constructor(public name: string) {

  }

  public setProperties(properties: IResourceProperties) {
    this.properties = properties;
  }

}
