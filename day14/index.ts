import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day14(logger, testMode);
}

class Day14 extends Day {
  async part1(input: string[]): Promise<string> {
    let currentMask = '';
    const memRegex = /mem\[(\d+)]/;
    const memory = new Map<number, number>();
    for (const line of input) {
      if (line === '') {
        continue;
      }
      const [op, arg] = line.split(' = ');
      if (op === 'mask') {
        currentMask = arg;
      } else {
        const parsedOp = memRegex.exec(op);
        if (!parsedOp) {
          this.logger.error(`Unable to parse op as a memory command: ${line}`);
          continue;
        }
        const loc = +parsedOp[1];
        const masked = this.doValMask(currentMask, +arg);
        memory.set(loc, masked);
      }
    }
    const sumOfMem = Array.from(memory.values()).reduce((a, b) => a + b, 0);
    return sumOfMem.toString();
  }

  async part2(input: string[]): Promise<string> {
    let currentMask = '';
    const memRegex = /mem\[(\d+)]/;
    const memory = new Map<number, number>();
    for (const line of input) {
      if (line === '') {
        continue;
      }
      const [op, arg] = line.split(' = ');
      if (op === 'mask') {
        currentMask = arg;
      } else {
        const parsedOp = memRegex.exec(op);
        if (!parsedOp) {
          this.logger.error(`Unable to parse op as a memory command: ${line}`);
          continue;
        }
        const loc = this.doAddrMask(currentMask, +parsedOp[1]);
        loc.forEach(l => memory.set(l, +arg));
      }
    }
    const sumOfMem = Array.from(memory.values()).reduce((a, b) => a + b, 0);
    return sumOfMem.toString();
  }

  private doValMask(mask: string, num: number): number {
    const numAsBitstring = num.toString(2).padStart(36, '0');
    const out: string[] = [];
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === 'X') {
        out.push(numAsBitstring[i]);
      } else {
        out.push(mask[i]);
      }
    }
    return parseInt(out.join(''), 2);
  }

  private doAddrMask(mask: string, num: number): number[] {
    const numAsBitstring = num.toString(2).padStart(36, '0');
    const outString: string[] = [];
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === '0') {
        outString.push(numAsBitstring[i]);
      } else if (mask[i] === 'X') {
        outString.push('X');
      } else {
        outString.push('1');
      }
    }
    const finalBitString = outString.join('');
    const working = [finalBitString];
    const out: number[] = [];
    while (working.length > 0) {
      this.logger.debug(`Working: ${working.join(',')}`);
      const active = working.pop() ?? '';
      if (active.includes('X')) {
        working.push(active.replace('X', '1'), active.replace('X', '0'));
      } else {
        out.push(parseInt(active, 2));
      }
    }
    return out;
  }
}
