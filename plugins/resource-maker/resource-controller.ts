import { IResourceProperties } from './resource-model.d.ts';
import { IResourceControllerContext, IResourceControllerPopulates } from './resource-controller.d.ts';
import { makeCollectionName, transformToQueryPopulates, Query, ObjectId } from '../../deps.ts';


export class ResourceController<T, TF> {

  private collectionName: string;


  constructor(public name: string, public properties: IResourceProperties) {
    this.collectionName = makeCollectionName(name);
  }


  private applyPopulates(populates: IResourceControllerPopulates, query: Query<TF>) {
    query.populate(
      ...transformToQueryPopulates(
        this.name,
        Object.entries(populates).map(entry => ({
          keyPath: entry[0],
          fields: entry[1] ? entry[1] : undefined
        }))
      )
    );
  }


  public list(context: IResourceControllerContext<T, TF>): Promise<TF[]> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.sorts) query.sort(context.sorts);
    if (context.populates) this.applyPopulates(context.populates, query);
    if (context.skip) query.skips(context.skip);
    if (context.limit) query.limits(context.limit);

    return query.query();

  }

  public count(context: IResourceControllerContext<T, TF>): Promise<number> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);

    return query.count();

  }

  public async retrieve(context: IResourceControllerContext<T, TF>): Promise<TF> {
    if (!context.resourceId) throw new Error('resourceId not specified');

    const query = new Query<TF>(this.collectionName);

    try {
      query.where({ _id: new ObjectId(context.resourceId) });
    }
    catch {
      throw new Error(`invalid retrieve resourceId format ${this.name}@${context.resourceId}`);
    }

    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.populates) this.applyPopulates(context.populates, query);

    const document = await query.queryOne();
    if (!document) throw new Error(`${this.name}@${context.resourceId} was not found.`);

    return document;

  }

  public async retrieveBy(context: IResourceControllerContext<T, TF>): Promise<TF> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.populates) this.applyPopulates(context.populates, query);

    const document = await query.queryOne();
    if (!document) throw new Error(`${this.name} where ${JSON.stringify(context.filters ?? {})} was not found.`);

    return document;

  }

  public findOne(context: IResourceControllerContext<T, TF>): Promise<TF | undefined> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.sorts) query.sort(context.sorts);
    if (context.populates) this.applyPopulates(context.populates, query);

    return query.queryOne();

  }


  public async create(context: IResourceControllerContext<T, TF>): Promise<TF> {
    if (!context.document) throw new Error(`${this.name} create info not given`);

    const query = new Query<TF>(this.collectionName);

    // todo: document validation

    for (const entry of Object.entries(context.document)) { // todo: loop over properties
      query.put(entry[0], entry[1]);
    }

    query.put('createdAt', Date.now());

    const document = await query.insert();
    if (!document) throw new Error(`could not insert ${this.name}`);

    return document;

  }

  public async update(context: IResourceControllerContext<T, TF>): Promise<TF> {
    if (!context.resourceId) throw new Error(`${this.name} update id not given.`);
    if (!context.payload) throw new Error(`${this.name}@${context.resourceId} update info not given.`);

    const query = new Query<TF>(this.collectionName);

    // todo: document validation

    try {
      query.where({ _id: new ObjectId(context.resourceId) });
    }
    catch {
      throw new Error(`invalid update resourceId format ${this.name}@${context.resourceId}`);
    }

    for (const entry of Object.entries(context.payload)) { // todo: loop over properties
      query.put(entry[0], entry[1]);
    }

    query.put('updatedAt', Date.now());

    const result = await query.commit();
    if (result.matchedCount === 0) throw new Error(`could not update ${this.name}@${context.resourceId}`);

    return this.retrieve({ resourceId: context.resourceId });

  }

  public async updateBy(context: IResourceControllerContext<T, TF>): Promise<boolean> {
    if (!context.filters) throw new Error(`${this.name} update filter not given.`);
    if (!context.payload) throw new Error(`${this.name} where ${JSON.stringify(context.filters)} update payload not given.`);

    const query = new Query<TF>(this.collectionName);

    // todo: document validation

    query.where(context.filters);

    for (const entry of Object.entries(context.payload)) {
      query.put(entry[0], entry[1]);
    }

    query.put('updatedAt', Date.now());

    const result = await query.commitMany();
    if (result.matchedCount === 0) throw new Error(`could not update ${this.name} where ${JSON.stringify(context.filters)}`);

    return true;

  }

  public async delete(context: IResourceControllerContext<T, TF>): Promise<boolean> {
    if (!context.resourceId) throw new Error(`${this.name} delete id not given.`);

    const query = new Query<TF>(this.collectionName);

    try {
      query.where({ _id: new ObjectId(context.resourceId) });
    }
    catch {
      throw new Error(`invalid delete resourceId format ${this.name}@${context.resourceId}`);
    }

    const result = await query.delete();
    if (result === 0) throw new Error(`could not delete ${this.name}@${context.resourceId}`);

    return true;

  }

  public async deleteBy(context: IResourceControllerContext<T, TF>): Promise<boolean> {
    if (!context.filters) throw new Error(`${this.name} delete filter not given.`);

    const query = new Query<TF>(this.collectionName);

    query.where(context.filters);

    const result = await query.deleteMany();
    if (result === 0) throw new Error(`could not delete ${this.name} where ${JSON.stringify(context.filters)}`);

    return true;

  }

}