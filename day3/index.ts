import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day3(logger);
}

class Day3 extends Day {
    part1(input: string[]): Promise<string> {
    const matrix = input.filter(x => x != '').map(row => row.split('').map(x => x === '#'));
    let trees = 0;

    for (let y = 0; y < matrix.length; y++) {
      const x = (3 * y) % matrix[0].length;
      this.logger.debug(`(${x}, ${y})`);

      if (matrix[y][x]) {
        trees++;
      }
    }
    return `${trees}`;
  }

  part2(input: string[]): Promise<string> {
    const slopes: Array<{x: number; y: number}> = [
      {x: 1, y: 1},
      {x: 3, y: 1},
      {x: 5, y: 1},
      {x: 7, y: 1},
      {x: 1, y: 2},
    ];
    const matrix = input.filter(x => x != '').map(row => row.split('').map(x => x === '#'));
    let out = 1;
    for (const slope of slopes) {
      let trees = 0;

      for (let y = 0; y < matrix.length; y += slope.y) {
        const x = ((slope.x / slope.y) * y) % matrix[0].length;
        // this.logger.debug(`(${x}, ${y})`);

        if (matrix[y][x]) {
          trees++;
        }
      }
      this.logger.info(`Slope right ${slope.x} down ${slope.y} hits trees ${trees}`);
      out *= trees;
    }
    return `${out}`;
  }
}
