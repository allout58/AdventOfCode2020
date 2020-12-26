import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day15(logger, testMode);
}

class Day15 extends Day {
  async part1(input: string[]): Promise<string> {
    const maxTurn = 2020;
    // const maxTurn = 10;
    const start = input[0].split(',').map(x => +x);
    const lastOccurrence = new Map<number, number[]>();
    for (let i = 0; i < start.length; i++) {
      lastOccurrence.set(start[i], [i]);
      this.logger.debug(`Turn ${i + 1}: say ${start[i]}`);
    }
    let lastNumber = start[start.length - 1];
    for (let turn = start.length; turn < maxTurn; turn++) {
      if (!lastOccurrence.has(lastNumber)) {
        this.logger.fatal(`The last occurrence of ${lastNumber} not found, fatal`);
        return 'error';
      }
      const occurrenceArr = lastOccurrence.get(lastNumber) as number[];
      if (occurrenceArr.length === 1) {
        lastNumber = 0;
      } else {
        const olderOccurrence = occurrenceArr.shift() as number;
        const mostRecentOccurrence = occurrenceArr[0];
        lastNumber = mostRecentOccurrence - olderOccurrence;
      }
      const newOccArr = lastOccurrence.get(lastNumber) ?? [];
      if (newOccArr.length === 0) {
        lastOccurrence.set(lastNumber, newOccArr);
      }
      newOccArr.push(turn);
      // this.logger.debug(`Turn ${turn + 1}: say ${lastNumber}`);
    }
    return `${lastNumber}`;
  }

  async part2(input: string[]): Promise<string> {
    const maxTurn = 30000000;
    // const maxTurn = 10;
    const start = input[0].split(',').map(x => +x);
    const lastOccurrence = new Map<number, number[]>();
    for (let i = 0; i < start.length; i++) {
      lastOccurrence.set(start[i], [i]);
      this.logger.debug(`Turn ${i + 1}: say ${start[i]}`);
    }
    let lastNumber = start[start.length - 1];
    for (let turn = start.length; turn < maxTurn; turn++) {
      if (!lastOccurrence.has(lastNumber)) {
        this.logger.fatal(`The last occurrence of ${lastNumber} not found, fatal`);
        return 'error';
      }
      const occurrenceArr = lastOccurrence.get(lastNumber) as number[];
      if (occurrenceArr.length === 1) {
        lastNumber = 0;
      } else {
        const olderOccurrence = occurrenceArr.shift() as number;
        const mostRecentOccurrence = occurrenceArr[0];
        lastNumber = mostRecentOccurrence - olderOccurrence;
      }
      const newOccArr = lastOccurrence.get(lastNumber) ?? [];
      if (newOccArr.length === 0) {
        lastOccurrence.set(lastNumber, newOccArr);
      }
      newOccArr.push(turn);
      // this.logger.debug(`Turn ${turn + 1}: say ${lastNumber}`);
    }
    return `${lastNumber}`;
  }
}
