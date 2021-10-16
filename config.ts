import { augmentConfiguration } from './deps.ts';

export const Config = {
  database: {
    enabled: true,
    host: '127.0.0.1',
    port: 27017,
    name: 'yback'
  },
  http: {
    enabled: true,
    port: 48500
  },
  media: {
    directory: 'media',
    baseUrl: 'http://localhost:48500'
  },
  authentication: {
    staticVerificationCode: '',
    randomDigitsCount: 4,
    tokenLifetime: 1000 * 60 * 60 * 24 * 30
  },
  authorization: {
    defaultPermissions: ['user.*']
  }
};

augmentConfiguration(Config);
