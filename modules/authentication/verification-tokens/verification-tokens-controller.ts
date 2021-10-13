import { VerificationTokenMaker } from './verification-tokens-resource.ts';
import './verification-tokens-model.ts';


export const VerificationTokenController = VerificationTokenMaker.getController();
