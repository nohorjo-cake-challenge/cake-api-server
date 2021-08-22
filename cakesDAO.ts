import { promises as fs } from 'fs';
import { ICake, validateCake } from 'cake-common';
import { pick } from 'lodash';

const cakesFile = `${__dirname}/data/cakes.json`;

function writeCakesFile(cakes: ICake[]): Promise<void> {
  return fs.writeFile(cakesFile, JSON.stringify(cakes, null, 4));
}

export function getAllCakes(): Promise<ICake[]> {
  return fs.readFile(cakesFile, 'utf8').then(data => JSON.parse(data));
}

export async function addCake(cake: ICake): Promise<ICake['id']> {
    if (!validateCake(cake)) {
        throw new Error('Invalid cake');
    }
    
    const cakes = await getAllCakes();
    const id = cakes.length ? (Math.max(...cakes.map(c => c.id)) + 1) : 0;
    cakes.push({
      ...pick(cake, [
        'name',
        'comment',
        'imageUrl',
        'yumFactor',
      ]),
      // increment id
      id,
    });

    await writeCakesFile(cakes);

    return id;
}

export async function deleteCake(id: ICake['id']): Promise<void> {
    const cakes = await getAllCakes();

    const index = cakes.findIndex(cake => cake.id === id);

    if (index === -1) {
        throw new Error('Cake not found');
    }

    cakes.splice(index, 1);

    writeCakesFile(cakes);
}

export default {
  getAllCakes,
  addCake,
  deleteCake,
};
