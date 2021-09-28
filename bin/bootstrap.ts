import { listenAndServe } from '../deps.ts';
import { handleHttpRequest } from "../transports/http.ts";


async function bootstrapHttp() {

  const httpListenAddress = ':48500';

  console.log(`http service listening on ${httpListenAddress}`)
  await listenAndServe(httpListenAddress, handleHttpRequest);

}


const services: Promise<unknown>[] = [];
services.push(bootstrapHttp());

await Promise.all(services);
