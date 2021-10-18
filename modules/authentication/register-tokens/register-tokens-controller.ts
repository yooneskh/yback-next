import { RegisterTokenMaker } from './register-tokens-resource.ts';
import './register-tokens-model.ts';


export const RegisterTokenController = RegisterTokenMaker.getController();


RegisterTokenMaker.addValidations({ });
