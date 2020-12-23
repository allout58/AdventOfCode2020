import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day6(logger);
}

class Day6 extends Day {
  async part1(input: string[]): Promise<string> {
    let group: Record<string, boolean> = {};
    let count = 0;
    for (const line of input) {
      if (line === '') {
        count += Object.keys(group).length;
        group = {};
      } else {
        const chars = line.split('');
        chars.forEach(c => (group[c] = true));
      }
    }
    count += Object.keys(group).length;
    return `${count}`;
  }

  async part2(input: string[]): Promise<string> {
    let group: Record<string, number> = {};
    let count = 0;
    let numRowsInGroup = 0;
    for (const line of input) {
      if (line === '') {
        this.logger.debug(`Group, ${JSON.stringify(group)}, numRowsInGroup: ${numRowsInGroup}`);
        count += Object.values(group).filter(x => x === numRowsInGroup).length;
        group = {};
        numRowsInGroup = 0;
      } else {
        numRowsInGroup++;
        const chars = line.split('');
        chars.forEach(c => {
          if (!group[c]) {
            group[c] = 0;
          }
          group[c] += 1;
        });
      }
    }
    count += Object.values(group).filter(x => x === numRowsInGroup).length;
    return `${count}`;
  }
}
