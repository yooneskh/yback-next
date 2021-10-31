import { ApplicationSettingMaker } from './application-settings-resource.ts';
import './application-settings-model.ts';


export const ApplicationSettingController = ApplicationSettingMaker.getController();


ApplicationSettingMaker.addValidations({
  name: [
    it => it.name === 'Application' || 'name must be Application'
  ]
});
