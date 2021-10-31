import { ApplicationSettingMaker } from './application-settings-resource.ts';
import './application-settings-controller.ts';


ApplicationSettingMaker.addActions({
  'retrieve': {
    ...ApplicationSettingMaker.getRetrieveRoute(),
    permission: 'admin.application-setting.retrieve'
  },
  'update': {
    ...ApplicationSettingMaker.getUpdateRoute(),
    permission: 'admin.application-setting.update'
  }
});


export const ApplicationSettingRouter = ApplicationSettingMaker.getRouter();
