import { ConnInfo } from '../deps.ts';

export function handleHttpRequest(request: Request, connectionInfo: ConnInfo): Response {
  return new Response(JSON.stringify([ connectionInfo, request.url, request.method, request.headers.entries() ]));
}
