import { registerPopulateItem } from "../../deps.ts";
import { ResourceController } from "./resource-controller.ts";
import { IResourceProperties } from './resource-model.d.ts';


export class ResourceMaker<T, TF> {

  public properties: IResourceProperties = {};

  private controller?: ResourceController<T, TF>;


  constructor(public name: string) {

  }


  public setProperties(properties: IResourceProperties) {
    this.properties = properties;
  }

  public makeModel() {

    for (const property in this.properties) {
      if (this.properties[property].ref) {
        registerPopulateItem({
          model: this.name,
          key: property,
          ref: this.properties[property].ref!
        });
      }
    }

  }

  public getController(): ResourceController<T, TF> {
    if (this.controller) {
      throw new Error(`${this.name} controller has been already made.`);
    }

    this.controller = new ResourceController<T, TF>(this.name, this.properties);
    return this.controller;

  }


}
