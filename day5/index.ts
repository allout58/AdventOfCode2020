import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day5(logger);
}

class Day5 extends Day {
  async part1(input: string[]): Promise<string> {
    let highestId = -1;
    for (const line of input) {
      if (line === '') {
        continue;
      }
      const seatId = Number.parseInt(
        line
          .split('')
          .map(char => (['B', 'R'].includes(char) ? '1' : '0'))
          .join(''),
        2
      );
      this.logger.debug(`Line ${line}: ${seatId}`);
      highestId = Math.max(highestId, seatId);
    }
    return highestId.toString();
  }

  async part2(input: string[]): Promise<string> {
    const inputAsNumbers = input
      .filter(x => x !== '')
      .map(
        line =>
          Number.parseInt(
            line
              .split('')
              .map(char => (['B', 'R'].includes(char) ? '1' : '0'))
              .join(''),
            2
          ) as number
      )
      .sort();
    const found =
      inputAsNumbers.find((val, ndx) => {
        return val + 2 === inputAsNumbers[ndx + 1];
      }) ?? -2;
    return `${found + 1}`;
  }
}
