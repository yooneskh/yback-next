import { ResourceMaker } from '../../plugins/resource-maker/resource-maker.ts';
import { IUserBase, IUser } from './users-interfaces.d.ts';


export const UserMaker = new ResourceMaker<IUserBase, IUser>('User');
