import { Config }  from './config.ts';

const timeStart = Date.now();


async function bootstrapDatabase() {

  const { connect } = await import('./deps.ts');

  if (!( Config.database.connectionString || (Config.database.host && Config.database.port && Config.database.name) )) {
    throw new Error('database connection information is insufficient');
  }

  const connectionString = Config.database.connectionString || `mongo://${Config.database.host}:${Config.database.port}/${Config.database.name}`;
  await connect(connectionString);

}

async function bootstrapHttp() {

  const { setupHttpTransport } = await import('./transports/http.ts');

  if (!Config.http.port) {
    throw new Error('http listen port not provided');
  }

  const httpListenAddress = `:${Config.http.port}`;

  setupHttpTransport(Config.http.port, () => {
    console.log(`http service listening on ${httpListenAddress} -- time took: ${Date.now() - timeStart} ms`);
  });

}


const services: Promise<unknown>[] = [];

if (Config.database.enabled) {
  services.push(bootstrapDatabase());
}

if (Config.http.enabled) {
  services.push(bootstrapHttp());
}

await Promise.all(services);
