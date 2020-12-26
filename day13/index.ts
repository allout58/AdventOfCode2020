import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day13(logger, testMode);
}

class Day13 extends Day {
  async part1(input: string[]): Promise<string> {
    const earliestTime = +input[0];
    const busses = input[1]
      .split(',')
      .filter(x => x != 'x')
      .map(x => +x);
    const diffs = busses.map(bus => {
      const closestTime = Math.ceil(earliestTime / bus) * bus;
      return {bus, diff: closestTime - earliestTime};
    });
    let smallestBus = diffs[0];
    for (const b of diffs) {
      if (b.diff < smallestBus.diff) {
        smallestBus = b;
      }
    }
    return `${smallestBus.diff * smallestBus.bus}`;
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }
}
