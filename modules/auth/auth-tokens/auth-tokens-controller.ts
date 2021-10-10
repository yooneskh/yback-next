import { AuthTokenMaker } from './auth-tokens-resource.ts';
import './auth-tokens-model.ts';


export const AuthTokenController = AuthTokenMaker.getController();
