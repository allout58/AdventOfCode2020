import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day1(logger);
}

class Day1 extends Day {
  part1(input: string[]): string {
    // const bar = new SingleBar({stopOnComplete: true}, Presets.shades_classic);
    // bar.start(input.length * input.length, 0);
    const inputAsNumbers = input.filter(x => x != '').map(x => +x);
    this.logger.debug(inputAsNumbers.length);
    for (let i = 0; i < inputAsNumbers.length; i++) {
      // if(i % 100 === 0) {
      //   this.logger.info(`First Number: ${i}`)
      // }
      const firstNumber = inputAsNumbers[i];
      for (let j = i + 1; j < inputAsNumbers.length; j++) {
        const secondNumber = inputAsNumbers[j];
        // if(j % 100 === 0) {
        //   this.logger.info(`Second Number: ${j}`)
        // }
        // bar.increment();

        if (firstNumber + secondNumber === 2020) {
          return String(firstNumber * secondNumber);
        }
      }
    }
    return 'not-found';
  }

  part2(input: string[]): string {
    // const bar = new SingleBar({stopOnComplete: true}, Presets.shades_classic);
    // bar.start(input.length * input.length, 0);
    const inputAsNumbers = input.filter(x => x != '').map(x => +x);
    this.logger.debug(inputAsNumbers.length);
    for (let i = 0; i < inputAsNumbers.length; i++) {
      const firstNumber = inputAsNumbers[i];
      for (let j = i + 1; j < inputAsNumbers.length; j++) {
        const secondNumber = inputAsNumbers[j];

        for (let k = j + 1; k < inputAsNumbers.length; k++) {
          const thirdNumber = inputAsNumbers[k];

          if (firstNumber + secondNumber + thirdNumber === 2020) {
            this.logger.info(`${firstNumber}, ${secondNumber}, ${thirdNumber}`);
            return String(firstNumber * secondNumber * thirdNumber);
          }
        }
      }
    }
    return 'not-found';
  }
}
