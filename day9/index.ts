import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day9(logger);
}

class Day9 extends Day {
  async part1(input: string[]): Promise<string> {
    // const backlog = 5;
    const backlog = 25;
    for (let start = 0, end = backlog, looking = backlog + 1; looking < input.length; start++, end++, looking++) {
      const map = new Map<number, boolean>();
      const lookingNumber = +input[looking];
      for (let i = start; i < end; i++) {
        map.set(+input[i], true);
      }
      let found = false;
      for (let i = start; i <= end; i++) {
        const num = +input[i];
        const diff = lookingNumber - num;
        if (map.has(diff)) {
          found = true;
          break;
        }
      }
      if (!found) {
        return `${lookingNumber}`;
      }
    }
    return 'not-found';
  }

  async part2(input: string[]): Promise<string> {
    const parsed = input.filter(x => x).map(x => +x);
    // const badNumber = 127;
    const badNumber = 1930745883;
    for (let start = 0; start < parsed.length; start++) {
      let currentSum = 0;
      let end = start;
      while (currentSum < badNumber) {
        currentSum += parsed[end++];
      }
      if (currentSum === badNumber) {
        const range = parsed.slice(start, end);
        this.logger.debug(`found range: ${range.join(', ')}`);
        const biggest = Math.max(...range);
        const smallest = Math.min(...range);
        this.logger.debug(`min ${smallest} max ${biggest}`);
        return `${smallest + biggest}`;
      }
    }
    return 'not-found';
  }
}
