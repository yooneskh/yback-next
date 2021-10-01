import { plural } from '../../deps.ts';


export function makeCollectionName(name: string) {
  return plural(name).toLowerCase();
}
