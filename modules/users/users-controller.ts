import { UserMaker } from './users-resource.ts';
import './users-model.ts';


export const UserController = UserMaker.getController();

UserMaker.addValidations({
  phoneNumber: [
    it => it.phoneNumber.startsWith('+98') || 'phoneNumber must start with +98',
    it => it.phoneNumber.length === 13 || 'phoneNumber must be 13 chars long'
  ]
});
