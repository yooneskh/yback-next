import { registerPopulateItem } from "../../deps.ts";
import { IResourceProperties } from './resource-model.d.ts';


export class ResourceMaker<T, TF> {

  public properties: IResourceProperties = {};


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


}
