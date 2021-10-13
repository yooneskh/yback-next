import { EventEmitter } from '../../../services/event-emitter.ts';
import { AuthorizationTokenController } from './authorization-tokens-controller.ts';


EventEmitter.on('Resource.User.Created', async (_, userId: string) => {
  await AuthorizationTokenController.create({
    document: {
      user: userId,
      permissions: ['user.*'],
      roles: []
    }
  });
});
