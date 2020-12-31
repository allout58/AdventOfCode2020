import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day23(logger, testMode);
}

const ONE_MIL = 1_000_000;
const TEN_MIL = 10_000_000;

class Day23 extends Day {
  async part1(input: string[]): Promise<string> {
    const cups = input[0].split('').map(x => +x);
    const numCups = cups.length;
    const lowestCup = Math.min(...cups);
    const highestCup = Math.max(...cups);
    let currentCup = cups[0];
    let currentIndex = 0;

    for (let move = 0; move < 100; move++) {
      this.logger.debug(`-- move ${move + 1} --`);
      this.logger.debug(`cups: ${cups.map(x => (x === currentCup ? `(${x})` : ` ${x} `)).join('')}`);
      const nextThree = cups.splice(currentIndex + 1, 3);
      this.logger.debug(`pick up: ${nextThree.join(', ')}`);
      let destCup = currentCup - 1 < lowestCup ? highestCup : currentCup - 1;
      while (!cups.includes(destCup)) {
        destCup = destCup - 1 < lowestCup ? highestCup : destCup - 1;
      }
      this.logger.debug(`destination: ${destCup}`);
      const destIndex = cups.indexOf(destCup);
      cups.splice(destIndex + 1, 0, ...nextThree);
      // Rotate the array so that  we don't have to deal with splicing over the end
      while (cups.indexOf(currentCup) + 5 >= numCups) {
        cups.push(cups.shift()!!);
      }
      currentIndex = (cups.indexOf(currentCup) + 1) % numCups;
      currentCup = cups[currentIndex];
    }

    this.logger.debug(`-- final --`);
    this.logger.debug(`cups: ${cups.map(x => (x === currentCup ? `(${x})` : ` ${x} `)).join('')}`);

    const combined = [...cups, ...cups];
    const start1 = combined.indexOf(1);
    const end1 = combined.lastIndexOf(1);
    return `${combined.slice(start1 + 1, end1).join('')}`;
  }

  async part2(input: string[]): Promise<string> {
    // Grab the input
    const inputCups = input[0].split('').map(x => +x);
    // Create an array from 1-1mil
    const cups = Array(ONE_MIL)
      .fill(0)
      .map((_, index) => index);
    // Overwrite the first `inputCups.length` with `inputCups`
    cups.splice(0, inputCups.length, ...inputCups);
    const numCups = cups.length;
    const lowestCup = 1;
    const highestCup = ONE_MIL;
    let currentCup = cups[0];
    let currentIndex = 0;

    const startTime = Date.now();

    for (let move = 0; move < TEN_MIL; move++) {
      if (move % 10_000 === 0) {
        const t = Math.floor((Date.now() - startTime) / 1000);
        this.logger.debug(`-- move ${move + 1} (${Math.floor(t / 60)}min${t % 60}sec) --`);
      }
      // this.logger.debug(`cups: ${cups.map(x => (x === currentCup ? `(${x})` : ` ${x} `)).join('')}`);
      const nextThree = cups.splice(currentIndex + 1, 3);
      // this.logger.debug(`pick up: ${nextThree.join(', ')}`);
      let destCup = currentCup - 1 < lowestCup ? highestCup : currentCup - 1;
      while (!cups.includes(destCup)) {
        destCup = destCup - 1 < lowestCup ? highestCup : destCup - 1;
      }
      // this.logger.debug(`destination: ${destCup}`);
      const destIndex = cups.indexOf(destCup);
      cups.splice(destIndex + 1, 0, ...nextThree);
      // Rotate the array so that  we don't have to deal with splicing over the end
      while (cups.indexOf(currentCup) + 5 >= numCups) {
        cups.push(cups.shift()!!);
      }
      currentIndex = (cups.indexOf(currentCup) + 1) % numCups;
      currentCup = cups[currentIndex];
    }

    // this.logger.debug(`-- final --`);
    // this.logger.debug(`cups: ${cups.map(x => (x === currentCup ? `(${x})` : ` ${x} `)).join('')}`);
    // TODO: Rotate twice, then grab the two cups clockwise of 1
    cups.push(cups.shift()!!);
    cups.push(cups.shift()!!);
    const oneIndex = cups.indexOf(1);
    const [num1, num2] = cups.slice(oneIndex + 1, oneIndex + 3);
    this.logger.info(`num1: ${num1}, num2: ${num2}`);
    return `${num1 * num2}`;
  }
}
