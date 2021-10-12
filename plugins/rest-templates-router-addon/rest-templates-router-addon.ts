import { ResourceMaker } from '../resource-maker/resource-maker.ts';
import { makeFiltersFromQuery } from "./y-router-rest-templates-util.ts";
// deno-lint-ignore no-unused-vars
import type { IResourceAction, IResourceActionContext } from '../resource-maker/resource-router.d.ts';


declare module '../resource-maker/resource-router.d.ts' {

  interface IResourceAction<T, TF> {
    template?: 'list' | 'count' | 'retrieve' | 'create' | 'update' | 'delete';
  }

  interface IResourceActionContext<T, TF> {
    resourceId?: string;
    // deno-lint-ignore no-explicit-any
    filters?: any;
    selects?: string[];
    sorts?: Record<string, number>;
    populates?: Record<string, string>;
    skip?: number;
    limit?: number;
  }

}


ResourceMaker.addGlobalPreware(context => {

  const { query, params } = context;

  if (params.resourceId) {
    context.resourceId = params.resourceId;
  }

  if (query.filters) {
    context.filters = makeFiltersFromQuery(query.filters);
  }

  if (query.selects) {
    context.selects = query.selects.split(' ');
  }

  if (query.sorts) {
    context.sorts = Object.fromEntries(
      query.sorts.split(',').map(part => {
        const items = part.split(':');
        return [items[0], items[1] === '1' ? 1 : -1];
      })
    );
  }

  if (query.populates) {
    context.populates = Object.fromEntries(
      query.populates.split(',').map(it =>
        it.split(':')
      )
    );
  }

  if (query.skip) {
    context.skip = parseInt(query.skip, 10);
  }

  if (query.limit) {
    context.limit = Math.min(parseInt(query.limit, 10), 30);
  }

});


ResourceMaker.addGlobalActionAugmentor(({ template }) => {
  if (!template) return;

  switch (template) {
    case 'list': return {
      template: undefined,
      method: 'get',
      path: '/',
      provider: ({ controller, query, filters, selects, sorts, populates, skip, limit }) => {
        if (!query.single) {
          return controller.list({
            filters,
            selects,
            sorts,
            populates,
            skip,
            limit
          });
        }
        else {
          return controller.retrieveBy({
            filters,
            selects,
            populates
          });
        }
      }
    };
    case 'count': return {
      template: undefined,
      method: 'get',
      path: '/count',
      provider: ({ controller, filters }) => {
        return controller.count({
          filters
        });
      }
    };
    case 'retrieve': return {
      template: undefined,
      method: 'get',
      path: '/:resourceId',
      provider: ({ controller, resourceId, selects, populates }) => {
        return controller.retrieve({
          resourceId,
          selects,
          populates
        });
      }
    };
    case 'create': return {
      template: undefined,
      method: 'post',
      path: '/',
      provider: ({ controller, payload }) => {
        return controller.create({
          document: payload
        });
      }
    };
    case 'update': return {
      template: undefined,
      method: 'patch',
      path: '/:resourceId',
      provider: ({ controller, resourceId, payload }) => {
        return controller.update({
          resourceId,
          payload
        });
      }
    };
    case 'delete': return {
      template: undefined,
      method: 'delete',
      path: '/:resourceId',
      provider: ({ controller, resourceId }) => {
        return controller.delete({
          resourceId
        });
      }
    };
  }

});
