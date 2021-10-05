import { registerPopulateItem } from '../../deps.ts';
import { Augmentor } from '../augment-looper/augment-looper.ts';
import { ResourceController } from './resource-controller.ts';
import { IResourceProperties } from './resource-model.d.ts';
import { IResourceAction, IResourceWare } from './resource-router.d.ts';
import { ResourceRouter } from './resource-router.ts';


export class ResourceMaker<T, TF> {

  constructor(public name: string) {

  }


  public properties: IResourceProperties = {};

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


  private controller?: ResourceController<T, TF>;

  public getController(): ResourceController<T, TF> {
    if (this.controller) {
      throw new Error(`${this.name} controller has been already made.`);
    }

    this.controller = new ResourceController<T, TF>(this.name, this.properties);
    return this.controller;

  }


  // deno-lint-ignore no-explicit-any
  private static globalPrewares: IResourceWare<any, any>[] = [];
  // deno-lint-ignore no-explicit-any
  private static globalPostwares: IResourceWare<any, any>[] = [];
  // deno-lint-ignore no-explicit-any
  private static globalActionAugmentors: Augmentor< IResourceAction<any, any> >[] = [];

  public static addGlobalPreware<T, TF>(ware: IResourceWare<T, TF>) {
    this.globalPrewares.push(ware);
  }

  public static addGlobalPostware<T, TF>(ware: IResourceWare<T, TF>) {
    this.globalPostwares.push(ware);
  }

  public static addGlobalActionAugmentor<T, TF>(augmentor: Augmentor< IResourceAction<T, TF> >) {
    this.globalActionAugmentors.push(augmentor);
  }

  private router?: ResourceRouter<T, TF>;
  public actions: IResourceAction<T, TF>[] = [];

  public addAction(action: IResourceAction<T, TF>) {
    this.actions.push(action);
  }

  public addActions(actions: IResourceAction<T, TF>[]) {
    for (const action of actions) {
      this.actions.push(action);
    }
  }

  public getRouter() {
    if (this.router) {
      throw new Error(`${this.name} router is already made`);
    }

    this.router = new ResourceRouter<T, TF>(this.name, this.controller);

    for (const ware of ResourceMaker.globalPrewares) {
      this.router.addPreware(ware);
    }

    for (const ware of ResourceMaker.globalPostwares) {
      this.router.addPostware(ware);
    }

    for (const augmentor of ResourceMaker.globalActionAugmentors) {
      this.router.addActionAumenter(augmentor);
    }

    this.router.addActions(this.actions);

    return this.router.getRouter();

  }

}
