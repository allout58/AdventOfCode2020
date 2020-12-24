import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day8(logger);
}

class Day8 extends Day {
  async part1(input: string[]): Promise<string> {
    let acc = 0;
    let progCnt = 0;
    let order = 0;
    const foundInstructions: Record<number, boolean> = {};
    while (!foundInstructions[progCnt]) {
      foundInstructions[progCnt] = true;
      const nextIns = input[progCnt];
      const [op, arg] = nextIns.split(' ');
      const argNum = +arg;
      this.logger.debug(`[${order}] ProgCng: ${progCnt}, op: ${op}, argNum: ${argNum}`);
      switch (op) {
        case 'nop':
          progCnt++;
          break;
        case 'acc':
          acc += argNum;
          progCnt++;
          break;
        case 'jmp':
          progCnt += argNum;
          break;
      }
      order++;
    }
    return `${acc}`;
  }

  async part2(input: string[]): Promise<string> {
    const filtered = input.filter(x => x != '');
    let tryProg = [...filtered];
    let terminateAcc = this.doesTerminate(tryProg);
    let swapPgrCnt = -1;
    let swappedInstruction = '';
    let runs = 0;
    while (terminateAcc === -1) {
      runs++;
      if (runs >= filtered.length) {
        this.logger.error('Too many tries');
        break;
      }
      if (swapPgrCnt + 1 >= filtered.length) {
        this.logger.error('All possible swaps made');
        break;
      }
      for (let i = swapPgrCnt + 1; i < filtered.length; i++) {
        const [op, arg] = filtered[i].split(' ');
        if (op === 'nop') {
          swapPgrCnt = i;
          swappedInstruction = ['jmp', arg].join(' ');
          this.logger.debug(`[nop] SwapPgrCnt: ${swapPgrCnt}`);
          break;
        } else if (op === 'jmp') {
          swapPgrCnt = i;
          swappedInstruction = ['nop', arg].join(' ');
          this.logger.debug(`[jmp] SwapPgrCnt: ${swapPgrCnt}`);
          break;
        }
      }
      tryProg = [...filtered.slice(0, swapPgrCnt), swappedInstruction, ...filtered.slice(swapPgrCnt + 1)];
      this.logger.debug(`Program after a swap: \n\t${tryProg.join('\n\t')}`);
      terminateAcc = this.doesTerminate(tryProg);
    }

    return `${terminateAcc}`;
  }

  private doesTerminate(input: string[]): number {
    let acc = 0;
    let progCnt = 0;
    let order = 0;
    const foundInstructions: Record<number, boolean> = {};
    while (progCnt < input.length) {
      if (foundInstructions[progCnt]) {
        this.logger.info('Did NOT terminate');
        return -1;
      }
      foundInstructions[progCnt] = true;
      const nextIns = input[progCnt];
      const [op, arg] = nextIns.split(' ');
      const argNum = +arg;
      this.logger.debug(`[${order}] ProgCng: ${progCnt}, op: ${op}, argNum: ${argNum}`);
      switch (op) {
        case 'nop':
          progCnt++;
          break;
        case 'acc':
          acc += argNum;
          progCnt++;
          break;
        case 'jmp':
          progCnt += argNum;
          break;
      }
      order++;
    }
    this.logger.info('Program terminated');
    return acc;
  }
}
