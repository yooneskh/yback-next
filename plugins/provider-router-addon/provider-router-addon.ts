import { ResourceMaker } from '../resource-maker/resource-maker.ts';
import type { IResourceBase } from '../resource-maker/resource-model.d.ts';
import type { IResourceActionFunction, IResourceActionMultiFunction, IResourceVersioned } from '../resource-maker/resource-router.d.ts';


declare module '../resource-maker/resource-router.d.ts' {
  interface IResourceAction<T, TF> {
    provider?: IResourceActionMultiFunction<T, TF> | IResourceVersioned<IResourceActionMultiFunction<T, TF>>;
  }
}


function transformSimpleProviderHandler<T, TF extends IResourceBase>(provider: IResourceActionMultiFunction<T, TF>): IResourceActionFunction<T, TF> {
  if (typeof provider === 'function') {
    return async (context) => {
      const data = await provider(context);
      context.response.json(data);
    }
  }
  else if (Array.isArray(provider)) {
    return async (context) => {
      const data = await Promise.all(provider.map(it => it(context)));
      context.response.json(data);
    }
  }
  else {
    return async (context) => {

      const data = Object.fromEntries(
        await Promise.all(
          Object.entries(provider).map(async ([key, func]) =>
            [key, await func(context)]
          )
        )
      );

      context.response.json(data);

    }
  }
}


ResourceMaker.addGlobalActionAugmentor(({ handler, provider }) => {
  if (!provider || handler) return;

  const isDefinitelySimpleProvider = typeof provider === 'function' || Array.isArray(provider);
  const canBeBoth = !isDefinitelySimpleProvider && Object.values(provider).every(it => typeof it === 'function');

  const prefersVersionedProviders = true; // false for labeled providers

  if (isDefinitelySimpleProvider || (canBeBoth && !prefersVersionedProviders)) {
    return {
      handler: transformSimpleProviderHandler(provider as IResourceActionMultiFunction<unknown, IResourceBase>)
    };
  }
  else {
    return {
      handler: Object.fromEntries(
        Object.entries(provider as IResourceVersioned<IResourceActionMultiFunction<unknown, IResourceBase>>).map(([version, providerEntry]) =>
          [
            version,
            transformSimpleProviderHandler(providerEntry)
          ]
        )
      )
    }
  }

});
