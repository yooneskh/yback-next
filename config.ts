import { augmentConfiguration } from "./deps.ts";

export const Config = {
  http: {
    enabled: true,
    port: 48500
  }
};

augmentConfiguration(Config);
