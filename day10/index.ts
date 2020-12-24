import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day10(logger);
}

class Day10 extends Day {
  async part1(input: string[]): Promise<string> {
    const inputAsNumbers = input
      .filter(x => x)
      .map(x => +x)
      .sort((a, b) => a - b);
    this.logger.debug(`Input as Numbers: ${inputAsNumbers.join(', ')}`);
    const computerJolt = Math.max(...inputAsNumbers) + 3;
    const diffMap = new Map<number, number>();
    this.logger.info(`Computer Jolt: ${computerJolt}`);
    const allJolts = [0, ...inputAsNumbers, computerJolt];
    this.logger.debug(`AllJolts: ${allJolts.join(', ')}`);
    const diffs = allJolts
      .map((value, index) => {
        if (index === allJolts.length - 1) {
          return null;
        } else {
          return allJolts[index + 1] - value;
        }
      })
      .filter(x => x != null) as number[];
    this.logger.debug(`Differences: ${diffs.join(', ')}`);
    diffs.forEach(val => diffMap.set(val, (diffMap.get(val) ?? 0) + 1));
    this.logger.debug(`Count of 1s: ${diffMap.get(1)}, 3s: ${diffMap.get(3)}`);
    const ones = diffMap.get(1) ?? 0;
    const threes = diffMap.get(3) ?? 0;
    return `${ones * threes}`;
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }
}
