import { UserController } from '../../users/users-controller.ts';
import { IUser } from '../../users/users-interfaces.d.ts';
import { AuthenticationTokenController } from '../authentication-tokens/authentication-tokens-controller.ts';


export async function getUserByToken(token: string | undefined): Promise<IUser | undefined> {
  if (!token) return undefined;

  try {

    const authenticationToken = await AuthenticationTokenController.retrieveBy({
      filters: {
        token,
        valid: true
      }
    });
    if (!authenticationToken) return undefined;

    if (authenticationToken.validUntil && Date.now() > authenticationToken.validUntil) {

      await AuthenticationTokenController.update({
        resourceId: authenticationToken._id,
        payload: {
          valid: false,
          invalidatedAt: Date.now()
        }
      });

      return undefined;

    }

    await AuthenticationTokenController.update({
      resourceId: authenticationToken._id,
      payload: {
        usedAt: [ ...(authenticationToken.usedAt || []), Date.now() ]
      }
    });

    return await UserController.retrieve({ resourceId: authenticationToken.user });

  }
  catch {
    return undefined;
  }

}
