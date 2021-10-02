import { UserMaker } from './users-resource.ts';
import './users-model.ts';


export const UserController = UserMaker.getController();
