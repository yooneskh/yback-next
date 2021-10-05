import { Router } from '../../deps.ts';
import { AugmentLooper, Augmentor } from '../augment-looper/augment-looper.ts';
import { ResourceController } from './resource-controller.ts';
import { IResourceAction, IResourceActionContext, IResourceWare } from './resource-router.d.ts';


export class ResourceRouter<T, TF> {

  private actions: IResourceAction<T, TF>[] = [];

  private prewares: IResourceWare<T, TF>[] = [];
  private postwares: IResourceWare<T, TF>[] = [];
  private actionAugmentLooper = new AugmentLooper< IResourceAction<T, TF> >();


  constructor(public name: string, public controller?: ResourceController<T, TF>) {

  }


  public addAction(action: IResourceAction<T, TF>) {
    this.actions.push(action);
  }

  public addActions(actions: IResourceAction<T, TF>[]) { // todo: handle label keyed object type
    for (const action of actions) {
      this.addAction(action);
    }
  }

  public addPreware(ware: IResourceWare<T, TF>) {
    this.prewares.push(ware);
  }

  public addPostware(ware: IResourceWare<T, TF>) {
    this.postwares.push(ware);
  }

  public addActionAumenter(augmenter: Augmentor< IResourceAction<T, TF> >) {
    this.actionAugmentLooper.addAugmentor(augmenter);
  }


  public getRouter() {

    const router = new Router();

    for (const action of this.actions) {

      this.actionAugmentLooper.augment(action);

      if (!action.method) throw new Error('action does not have method');
      if (!action.path) throw new Error('action does not have path');
      if (!action.handler) throw new Error('action does not have handler');

      router[action.method](action.path, async rev => {

        const context: IResourceActionContext<T, TF> = {
          action,
          requestEvent: rev,
          request: rev.request,
          response: rev.response,
          controller: this.controller!,
          params: rev.params,
          query: rev.query,
          headers: Object.fromEntries([...rev.request.headers.entries()])
        };

        for (const ware of this.prewares) {
          await ware(context);
        }

        await action.handler!(context);

        await Promise.all(
          this.postwares.map(ware =>
            ware(context)
          )
        );

      });

    }

    return router;

  }

}
