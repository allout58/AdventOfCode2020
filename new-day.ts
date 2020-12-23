import {default as consola} from 'consola';
import {default as fs} from 'fs';
import {resolve} from 'path';

// First arg to us, arg 0 is tsnode and arg 1 is this script
const day = process.argv[2];

if (!day || !day.match(/^day\d+$/)) {
  consola.error('Must have a valid [day] argument');
  process.exit(-1);
}

if (fs.existsSync(day)) {
  consola.error(`Day "${day}" already exists`);
  process.exit(-1);
}

const dayAsClassName = day.replace('day', 'Day');

fs.mkdirSync(day);
fs.writeFileSync(
  resolve(day, 'index.ts'),
  `import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new ${dayAsClassName}(logger);
}

class ${dayAsClassName} extends Day {
  async part1(input: string[]): Promise<string> {
    return '';
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }
}`
);
// TODO: Automatically grab this?
fs.writeFileSync(resolve(day, 'input'), '');
fs.writeFileSync(resolve(day, 'test'), '');
fs.writeFileSync(resolve(day, 'test2'), '');
