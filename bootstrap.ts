import { Config }  from './config.ts';

const timeStart = Date.now();


async function bootstrapHttp() {

  const { setupHttpTransport } = await import('./transports/http.ts');

  const httpListenAddress = `:${Config.http.port}`;

  setupHttpTransport(Config.http.port, () => {
    console.log(`http service listening on ${httpListenAddress} -- time took: ${Date.now() - timeStart} ms`);
  });

}


const services: Promise<unknown>[] = [];

if (Config.http.enabled) {
  services.push(bootstrapHttp());
}

await Promise.all(services);
