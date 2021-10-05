import { ResourceMaker } from '../resource-maker/resource-maker.ts';
import { IResourceActionMultiFunction } from '../resource-maker/resource-router.d.ts';


declare module '../resource-maker/resource-router.d.ts' {
  interface IResourceAction<T, TF> {
    provider?: IResourceActionMultiFunction<T, TF>;
  }
}


ResourceMaker.addGlobalActionAugmentor(({ handler, provider }) => {
  if (!provider || handler) return;

  if (typeof provider === 'function') {
    return {
      handler: async (context) => {
        const data = await provider(context);
        context.response.json(data);
      }
    }
  }
  else if (Array.isArray(provider)) {
    return {
      handler: async (context) => {
        const data = await Promise.all(provider.map(it => it(context)));
        context.response.json(data);
      }
    }
  }
  else {
    return {
      handler: async (context) => {

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

});
