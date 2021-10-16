import { registerProvider } from '../authentication-router/authentication-router.ts';
import { Config } from '../../../config.ts';
import { UserController } from '../../users/users-controller.ts';
import { VerificationTokenController } from '../verification-tokens/verification-tokens-controller.ts';
import { RegisterTokenController } from '../register-tokens/register-tokens-controller.ts';


function makeRandomDigits(digits: number): string {

  let result = '';

  for (let i = 0; i < digits; i++) {
    result += String(Math.trunc(Math.random() * 10));
  }

  return result;

}


registerProvider({
  identifier: 'phoneNumber',
  async login({ payload }) {

    const { phoneNumber } = payload;

    const user = await UserController.findBy({
      filters: {
        phoneNumber
      }
    });

    if (!user) {
      throw new Error(`user with this phoneNumber ${phoneNumber} was not found`);
    }

    const verificationToken = await VerificationTokenController.create({
      document: {
        user: String(user._id),
        channel: 'sms',
        code: Config.authentication.staticVerificationCode || makeRandomDigits(Config.authentication.randomDigitsCount)
      }
    });

    return {
      needsVerification: true,
      verificationToken: String(verificationToken._id)
    };

  },
  async register({ payload }) {

    const { name, phoneNumber } = payload;

    const prevUsers = await UserController.count({
      filters: {
        phoneNumber
      }
    });

    if (prevUsers !== 0) {
      throw new Error(`user with this phone number exists ${phoneNumber}`);
    }

    const registerToken = await RegisterTokenController.create({
      document: {
        name,
        phoneNumber
      }
    });

    const verificationToken = await VerificationTokenController.create({
      document: {
        registerToken: String(registerToken._id),
        channel: 'sms',
        code: Config.authentication.staticVerificationCode || makeRandomDigits(Config.authentication.randomDigitsCount)
      }
    });

    return {
      needsVerification: true,
      verificationToken: String(verificationToken._id)
    };

  },
  async verify({ payload }) {

    const { verificationToken, verificationCode } = payload;

    const verificationTokenDocument = await VerificationTokenController.retrieve({
      resourceId: verificationToken
    });

    if (verificationTokenDocument.used) {
      throw new Error('thsi verification token has been used before');
    }

    if (verificationTokenDocument.code !== verificationCode) {
      throw new Error('verification code is invalid');
    }

    if (!verificationTokenDocument.user && !verificationTokenDocument.registerToken) {
      throw new Error(`verification token has no user neither register token ${verificationToken}`);
    }

    let user = '';

    if (verificationTokenDocument.user) {
      user = verificationTokenDocument.user;
    }
    else if (verificationTokenDocument.registerToken) {

      const registerToken = await RegisterTokenController.retrieve({
        resourceId: verificationTokenDocument.registerToken
      });

      if (registerToken.used) {
        throw new Error(`register token has been used ${registerToken._id}`);
      }

      const userDocument = await UserController.create({
        document: {
          name: registerToken.name,
          phoneNumber: registerToken.phoneNumber
        }
      });

      await RegisterTokenController.update({
        resourceId: registerToken._id,
        payload: {
          used: true,
          usedAt: Date.now()
        }
      });

      user = String(userDocument._id);

    }

    await VerificationTokenController.update({
      resourceId: verificationToken,
      payload: {
        used: true,
        usedAt: Date.now()
      }
    });

    return user;

  }
});
