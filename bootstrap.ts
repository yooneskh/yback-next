import { listenAndServe } from './deps.ts';
import { Config } from "./config.ts";
import { handleHttpRequest } from "./transports/http.ts";


async function bootstrapHttp() {

  const httpListenAddress = `:${Config.http.port}`;

  console.log(`http service listening on ${httpListenAddress}`)
  await listenAndServe(httpListenAddress, handleHttpRequest);

}


const services: Promise<unknown>[] = [];

if (Config.http.enabled) {
  services.push(bootstrapHttp());
}

await Promise.all(services);
