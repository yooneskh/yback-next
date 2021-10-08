import { IResourceBase, IResourceProperties } from './resource-model.d.ts';
import { IResourceControllerContext, IResourceControllerPopulates } from './resource-controller.d.ts';
import { makeCollectionName, transformToQueryPopulates, Query, ObjectId } from '../../deps.ts';
import { EventEmitter } from '../../services/event-emitter.ts';


export class ResourceController<T, TF extends IResourceBase> {

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


  public async list(context: IResourceControllerContext<T, TF>): Promise<TF[]> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.sorts) query.sort(context.sorts);
    if (context.populates) this.applyPopulates(context.populates, query);
    if (context.skip) query.skips(context.skip);
    if (context.limit) query.limits(context.limit);

    const documents = await query.query();

    EventEmitter.emit(`Resource.${this.name}.Listed`, documents.map(it => it._id), documents);
    return documents;

  }

  public async count(context: IResourceControllerContext<T, TF>): Promise<number> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);

    const count = await query.count();

    EventEmitter.emit(`Resource.${this.name}.Counted`, count);
    return count;

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

    EventEmitter.emit(`Resource.${this.name}.Retrieved`, document._id, document);
    return document;

  }

  public async retrieveBy(context: IResourceControllerContext<T, TF>): Promise<TF> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.populates) this.applyPopulates(context.populates, query);

    const document = await query.queryOne();
    if (!document) throw new Error(`${this.name} where ${JSON.stringify(context.filters ?? {})} was not found.`);

    EventEmitter.emit(`Resource.${this.name}.RetrievedBy`, document._id, document);
    return document;

  }

  public async find(context: IResourceControllerContext<T, TF>): Promise<TF | undefined> {
    if (!context.resourceId) throw new Error('resourceId not specified');

    const query = new Query<TF>(this.collectionName);

    try {
      query.where({ _id: new ObjectId(context.resourceId) });
    }
    catch {
      throw new Error(`invalid find resourceId format ${this.name}@${context.resourceId}`);
    }

    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.populates) this.applyPopulates(context.populates, query);

    const document = await query.queryOne();

    EventEmitter.emit(`Resource.${this.name}.Found`, document?._id, document);
    return document;

  }

  public async findBy(context: IResourceControllerContext<T, TF>): Promise<TF | undefined> {

    const query = new Query<TF>(this.collectionName);

    if (context.filters) query.where(context.filters);
    if (context.selects) context.selects.forEach(it => query.projectIn(it));
    if (context.sorts) query.sort(context.sorts);
    if (context.populates) this.applyPopulates(context.populates, query);

    const document = await query.queryOne();

    EventEmitter.emit(`Resource.${this.name}.FoundBy`, document?._id, document);
    return document;

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
    if (!document) throw new Error(`could not create ${this.name}`);

    EventEmitter.emit(`Resource.${this.name}.Created`, document._id, document);
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

    const oldDocument = await query.queryOne();
    if (!oldDocument) throw new Error(`${this.name}@${context.resourceId} was not found for update`);

    for (const entry of Object.entries(context.payload)) { // todo: loop over properties
      query.put(entry[0], entry[1]);
    }

    query.put('updatedAt', Date.now());

    const result = await query.commit();
    if (result.matchedCount === 0) throw new Error(`could not update ${this.name}@${context.resourceId}`);

    const newDocument = await query.queryOne();
    if (!newDocument) throw new Error(`there was a problem updating ${this.name}@${context.resourceId}`);

    EventEmitter.emit(`Resource.${this.name}.Updated`, newDocument._id, newDocument, oldDocument._id, oldDocument);
    return newDocument;

  }

  public async updateBy(context: IResourceControllerContext<T, TF>): Promise<TF[]> {
    if (!context.filters) throw new Error(`${this.name} update filter not given.`);
    if (!context.payload) throw new Error(`${this.name} where ${JSON.stringify(context.filters)} update payload not given.`);

    const query = new Query<TF>(this.collectionName);

    // todo: document validation

    query.where(context.filters);

    const oldDocuments = await query.query();

    for (const entry of Object.entries(context.payload)) { // todo: loop over properties
      query.put(entry[0], entry[1]);
    }

    query.put('updatedAt', Date.now());

    const result = await query.commitMany();
    if (result.matchedCount === 0) throw new Error(`could not update ${this.name} where ${JSON.stringify(context.filters)}`);

    const changedDocumentsQuery = new Query<TF>(this.collectionName);
    changedDocumentsQuery.where({ _id: { $in: oldDocuments.map(it => it._id) } });
    const changedDocuments = await changedDocumentsQuery.query();

    EventEmitter.emit(`Resource.${this.name}.UpdatedBy`, changedDocuments.map(it => it._id), changedDocuments, oldDocuments.map(it => it._id), oldDocuments);
    return changedDocuments;

  }

  public async delete(context: IResourceControllerContext<T, TF>): Promise<TF> {
    if (!context.resourceId) throw new Error(`${this.name} delete id not given.`);

    const query = new Query<TF>(this.collectionName);

    try {
      query.where({ _id: new ObjectId(context.resourceId) });
    }
    catch {
      throw new Error(`invalid delete resourceId format ${this.name}@${context.resourceId}`);
    }

    const document = await query.queryOne();
    if (!document) throw new Error(`${this.name}@${context.resourceId} does not exist for delete`);

    const result = await query.delete();
    if (result === 0) throw new Error(`could not delete ${this.name}@${context.resourceId}`);

    EventEmitter.emit(`Resource.${this.name}.Deleted`, document._id, document);
    return document;

  }

  public async deleteBy(context: IResourceControllerContext<T, TF>): Promise<TF[]> {
    if (!context.filters) throw new Error(`${this.name} delete filter not given.`);

    const query = new Query<TF>(this.collectionName);

    query.where(context.filters);

    const documents = await query.query();

    const result = await query.deleteMany();
    if (result === 0) throw new Error(`could not delete ${this.name} where ${JSON.stringify(context.filters)}`);

    EventEmitter.emit(`Resource.${this.name}.DeletedBy`, documents.map(it => it._id), documents);
    return documents;

  }

}