import {Consola} from 'consola';
import {Day} from '../utils/day';
import {promises} from 'fs';

export default function (logger: Consola, testMode: boolean) {
  return new Day11(logger, testMode);
}

enum SeatStatus {
  floor = '.',
  empty = 'L',
  filled = '#',
}

type Model = SeatStatus[][];

class Day11 extends Day {
  async part1(input: string[]): Promise<string> {
    const model: Model = input.filter(x => x != '').map(x => x.split('').map(s => s as SeatStatus));
    const modelHeight = model.length;
    const modelWidth = model[0].length;
    this.logger.debug(`Model Width: ${modelWidth}, height: ${modelHeight}`);

    let lastModel: Model = model;
    let currentModel: Model = model;
    let iteration = 1;
    do {
      lastModel = currentModel;
      currentModel = lastModel.map(r => [...r]);
      for (let y = 0; y < modelHeight; y++) {
        for (let x = 0; x < modelWidth; x++) {
          const item = lastModel[y][x];
          if (item === SeatStatus.floor) {
            continue;
          }
          const left = Math.max(x - 1, 0);
          const right = Math.min(x + 1, modelWidth - 1);
          const top = Math.max(y - 1, 0);
          const bottom = Math.min(y + 1, modelHeight - 1);
          let filled = 0;
          this.logger.debug(`Checking surrounding for (${x}, ${y}) from (${top}, ${left}) to (${bottom}, ${right})`);
          for (let checkX = left; checkX <= right; checkX++) {
            for (let checkY = top; checkY <= bottom; checkY++) {
              if (checkY === y && checkX === x) {
                this.logger.debug(`Skipping ${checkX}, ${checkY} as it is self`);
                continue;
              }
              this.logger.debug(`Checking ${checkX}, ${checkY}`);
              if (lastModel[checkY][checkX] === SeatStatus.filled) {
                filled++;
              }
            }
          }
          if (item === SeatStatus.empty && filled === 0) {
            this.logger.debug(`Setting (${x},${y}) to filled, as no surrounding seats are filled`);
            currentModel[y][x] = SeatStatus.filled;
          } else if (item === SeatStatus.filled && filled >= 4) {
            this.logger.debug(`Setting (${y},${x}) to empty, as 4 or more seats were filled`);
            currentModel[y][x] = SeatStatus.empty;
          }
          this.logger.debug('');
        }
      }
      if (this.testMode) {
        await promises.writeFile(`day11/p1-test-${iteration}.txt`, currentModel.map(r => r.join('')).join('\n'));
      }
      iteration++;
    } while (currentModel.map(r => r.join('')).join('') !== lastModel.map(r => r.join('')).join(''));
    return currentModel
      .flat()
      .filter(x => x === SeatStatus.filled)
      .length.toString();
  }

  async part2(input: string[]): Promise<string> {
    const model: Model = input.filter(x => x != '').map(x => x.split('').map(s => s as SeatStatus));
    const modelHeight = model.length;
    const modelWidth = model[0].length;
    this.logger.debug(`Model Width: ${modelWidth}, height: ${modelHeight}`);

    let lastModel: Model = model;
    let currentModel: Model = model;
    let iteration = 1;
    do {
      lastModel = currentModel;
      currentModel = lastModel.map(r => [...r]);
      for (let y = 0; y < modelHeight; y++) {
        for (let x = 0; x < modelWidth; x++) {
          const item = lastModel[y][x];
          if (item === SeatStatus.floor) {
            continue;
          }
          let filled = 0;
          this.logger.debug(`Checking surrounding for (${x}, ${y})`);
          for (let checkDirX = -1; checkDirX <= 1; checkDirX++) {
            for (let checkDirY = -1; checkDirY <= 1; checkDirY++) {
              if (checkDirY === 0 && checkDirX === 0) {
                this.logger.debug(`Skipping ${checkDirX}, ${checkDirY} as it is self`);
                continue;
              }
              let directionMultiplier = 0;
              let check: SeatStatus = SeatStatus.floor;
              do {
                directionMultiplier++;
                const checkX = x + checkDirX * directionMultiplier;
                const checkY = y + checkDirY * directionMultiplier;
                if (checkX < 0 || checkX >= modelWidth || checkY < 0 || checkY >= modelHeight) {
                  break;
                }
                check = lastModel[checkY][checkX];
              } while (check === SeatStatus.floor);

              this.logger.debug(`Checking ${checkDirX}, ${checkDirY}`);
              if (check === SeatStatus.filled) {
                filled++;
              }
            }
          }
          if (item === SeatStatus.empty && filled === 0) {
            this.logger.debug(`Setting (${x},${y}) to filled, as no surrounding seats are filled`);
            currentModel[y][x] = SeatStatus.filled;
          } else if (item === SeatStatus.filled && filled >= 5) {
            this.logger.debug(`Setting (${y},${x}) to empty, as 5 or more seats were filled`);
            currentModel[y][x] = SeatStatus.empty;
          }
          this.logger.debug('');
        }
      }
      if (this.testMode) {
        await promises.writeFile(`day11/p2-test-${iteration}.txt`, currentModel.map(r => r.join('')).join('\n'));
      }
      iteration++;
    } while (currentModel.map(r => r.join('')).join('') !== lastModel.map(r => r.join('')).join(''));
    return currentModel
      .flat()
      .filter(x => x === SeatStatus.filled)
      .length.toString();
  }
}
