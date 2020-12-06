import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day2(logger);
}

const regex = /(\d+)-(\d+) ([a-z]): ([a-z]+)/;

class Day2 extends Day {
  part1(input: string[]): string {
    let validLines = 0;
    for (const line of input) {
      const matches = regex.exec(line);
      if (!matches) {
        this.logger.warn(`Unable to parse line: ${line}`);
        continue;
      }
      const minCount = +matches[1];
      const maxCount = +matches[2];
      const char = matches[3];
      const string = matches[4];
      const numChars = string.split('').filter(x => x === char).length;
      if (numChars >= minCount && numChars <= maxCount) {
        validLines++;
        this.logger.debug('Valid line');
      } else {
        this.logger.debug('Invalid line');
      }
    }
    return `${validLines}`;
  }

  part2(input: string[]): string {
    let validLines = 0;
    for (const line of input) {
      const matches = regex.exec(line);
      if (!matches) {
        this.logger.warn(`Unable to parse line: ${line}`);
        continue;
      }
      const startPlace = +matches[1];
      const endPlace = +matches[2];
      const char = matches[3];
      const string = matches[4];
      const startCharIsChar = string[startPlace - 1] === char;
      const endCharIsChar = string[endPlace - 1] === char;
      if ((startCharIsChar && !endCharIsChar) || (!startCharIsChar && endCharIsChar)) {
        validLines++;
        this.logger.debug('Valid line');
      } else {
        this.logger.debug('Invalid line');
      }
    }
    return `${validLines}`;
  }
}
