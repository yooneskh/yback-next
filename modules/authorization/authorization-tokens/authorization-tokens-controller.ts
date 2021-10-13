import { AuthorizationTokenMaker } from './authorization-tokens-resource.ts';
import './authorization-tokens-model.ts';


export const AuthorizationTokenController = AuthorizationTokenMaker.getController();
