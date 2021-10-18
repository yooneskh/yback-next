import { AuthenticationTokenMaker } from './authentication-tokens-resource.ts';
import './authentication-tokens-model.ts';


export const AuthenticationTokenController = AuthenticationTokenMaker.getController();


AuthenticationTokenMaker.addValidations({ });
