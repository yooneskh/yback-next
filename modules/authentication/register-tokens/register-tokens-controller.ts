import { RegisterTokenMaker } from './register-tokens-resource.ts';
import './register-tokens-model.ts';
import { isPhoneNumber } from '../../../tools/validation.ts';


export const RegisterTokenController = RegisterTokenMaker.getController();


RegisterTokenMaker.addValidations({
  'phoneNumber': [
    it => isPhoneNumber(it.phoneNumber) || 'phone number must be like +98xxxxxxxxxx'
  ]
});
