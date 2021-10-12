import { UserController } from '../../users/users-controller.ts';
import { IUser } from '../../users/users-interfaces.d.ts';
import { AuthTokenController } from '../auth-tokens/auth-tokens-controller.ts';

export async function getUserByToken(token: string | undefined): Promise<IUser | undefined> {
  if (!token) return undefined;

  try {

    const authToken = await AuthTokenController.retrieveBy({
      filters: {
        token,
        valid: true
      }
    });
    if (!authToken) return undefined;

    if (authToken.validUntil && Date.now() > authToken.validUntil) {

      await AuthTokenController.update({
        resourceId: authToken._id,
        payload: {
          valid: false,
          invalidatedAt: Date.now()
        }
      });

      return undefined;

    }

    await AuthTokenController.update({
      resourceId: authToken._id,
      payload: {
        usedAt: [ ...(authToken.usedAt || []), Date.now() ]
      }
    });

    return await UserController.retrieve({ resourceId: authToken.user });

  }
  catch {
    return undefined;
  }

}
