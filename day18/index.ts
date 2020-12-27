import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day18(logger, testMode);
}

type MathOp = '+' | '*' | '(' | ')' | number;

class Day18 extends Day {
  async part1(input: string[]): Promise<string> {
    const mathOp = (op: Exclude<MathOp, number>) => {
      switch (op) {
        case '+':
        case '*':
          return 0;
        case '(':
          return -1;
        case ')':
          return 2;
      }
    };
    let sum = 0;
    for (const line of input) {
      if (line === '') {
        continue;
      }
      if (line.startsWith('#')) {
        this.logger.info(`Skipping line ${line.slice(1)} as it is commented out`);
        continue;
      }
      const split = line
        .split('')
        .filter(x => x != ' ')
        .map(x => (/\d/.test(x) ? +x : x)) as MathOp[];
      const result = this.weirdMath(split, mathOp);
      this.logger.debug(`Line: ${line}; result: ${result}`);
      sum += result;
    }
    return `${sum}`;
  }

  async part2(input: string[]): Promise<string> {
    const mathOp = (op: Exclude<MathOp, number>) => {
      switch (op) {
        case '+':
          return 1;
        case '*':
          return 0;
        case '(':
          return -1;
        case ')':
          return 2;
      }
    };
    let sum = 0;
    for (const line of input) {
      if (line === '') {
        continue;
      }
      if (line.startsWith('#')) {
        this.logger.info(`Skipping line ${line.slice(1)} as it is commented out`);
        continue;
      }
      const split = line
        .split('')
        .filter(x => x != ' ')
        .map(x => (/\d/.test(x) ? +x : x)) as MathOp[];
      const result = this.weirdMath(split, mathOp);
      this.logger.debug(`Line: ${line}; result: ${result}`);
      sum += result;
    }
    return `${sum}`;
  }

  private weirdMath(line: MathOp[], operatorPrecedence: (op: Exclude<MathOp, number>) => number): number {
    const numberStack: number[] = [];
    const opStack: Exclude<MathOp, number>[] = [];
    for (const numOrOp of line) {
      if (numOrOp === '(') {
        opStack.push(numOrOp);
      } else if (typeof numOrOp === 'number') {
        numberStack.push(numOrOp);
      } else if (numOrOp === '*' || numOrOp === '+') {
        if (opStack.length > 0) {
          const topOp = opStack[opStack.length - 1];
          const topPrec = operatorPrecedence(topOp);
          const newPrec = operatorPrecedence(numOrOp);
          if (topPrec >= newPrec) {
            const res = this.compute(opStack, numberStack);
            numberStack.push(res);
          }
        }
        opStack.push(numOrOp);
      } else if (numOrOp === ')') {
        while (opStack[opStack.length - 1] != '(') {
          const res = this.compute(opStack, numberStack);
          numberStack.push(res);
        }
        opStack.pop();
      }
    }
    while (opStack.length > 0) {
      const res = this.compute(opStack, numberStack);
      numberStack.push(res);
    }
    return numberStack.pop() as number;
  }
  private compute(opStack: Exclude<MathOp, number>[], numberStack: number[]): number {
    const op = opStack.pop() as '*' | '+';
    const num1 = numberStack.pop() as number;
    const num2 = numberStack.pop() as number;
    // this.logger.debug(`Executing ${num1} ${op} ${num2}`);
    if (op === '+') {
      return num1 + num2;
    } else {
      return num1 * num2;
    }
  }
}
