import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day12(logger, testMode);
}

class Day12 extends Day {
  async part1(input: string[]): Promise<string> {
    const regex = /^([NSEWFLR])(\d+)$/;
    let x = 0;
    let y = 0;
    let rot = 0;
    for (const ins of input) {
      if (ins === '') {
        continue;
      }
      const match = regex.exec(ins);
      if (!match) {
        this.logger.error(`Unable to parse instruction: ${ins}`);
        continue;
      }
      let op = match[1] as 'N' | 'S' | 'E' | 'W' | 'F' | 'L' | 'R';
      const arg = +match[2];
      if (op === 'F') {
        const remainingRot = rot % 360;
        const modRot = remainingRot < 0 ? remainingRot + 360 : remainingRot;
        switch (modRot) {
          case 0:
            op = 'E';
            break;
          case 90:
            op = 'N';
            break;
          case 180:
            op = 'W';
            break;
          case 270:
            op = 'S';
            break;
          default:
            this.logger.error(`Unknown rotation: ${rot} (${modRot})`);
        }
      }
      switch (op) {
        case 'N':
          y += arg;
          break;
        case 'S':
          y -= arg;
          break;
        case 'E':
          x += arg;
          break;
        case 'W':
          x -= arg;
          break;
        case 'L':
          rot += arg;
          break;
        case 'R':
          rot -= arg;
          break;
        default:
          this.logger.error(`Unknown operation ${op}`);
      }
      this.logger.debug(`After ${ins}: ${x}, ${y} rot ${rot} (${op} ${arg})`);
    }
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    this.logger.debug(`Final: ${absX}, ${absY} rot: ${rot}`);
    return `${absX + absY}`;
  }

  async part2(input: string[]): Promise<string> {
    const regex = /^([NSEWFLR])(\d+)$/;
    let x = 0;
    let y = 0;
    let wayX = 10;
    let wayY = 1;
    for (const ins of input) {
      if (ins === '') {
        continue;
      }
      const match = regex.exec(ins);
      if (!match) {
        this.logger.error(`Unable to parse instruction: ${ins}`);
        continue;
      }
      let op = match[1] as 'N' | 'S' | 'E' | 'W' | 'F' | 'L' | 'R';
      const arg = +match[2];
      if (op === 'N') {
        wayY += arg;
      } else if (op === 'S') {
        wayY -= arg;
      } else if (op === 'E') {
        wayX += arg;
      } else if (op === 'W') {
        wayX -= arg;
      } else if (op === 'L' || op === 'R') {
        let rot = op === 'L' ? arg : -arg;
        const remainingRot = rot % 360;
        const modRot = remainingRot < 0 ? remainingRot + 360 : remainingRot;
        switch (modRot) {
          case 90:
            [wayX, wayY] = [-wayY, wayX];
            break;
          case 180:
            wayX = -wayX;
            wayY = -wayY;
            break;
          case 270:
            [wayX, wayY] = [wayY, -wayX];
            break;
          default:
            this.logger.error(`Unknown rotation: ${modRot} (${arg})`);
        }
      } else if (op === 'F') {
        x += arg * wayX;
        y += arg * wayY;
      } else {
        this.logger.error(`Unknown operation ${op}`);
      }
      this.logger.debug(`After ${ins}: ${x}, ${y} with waypoint ${wayX}, ${wayY} (${op} ${arg})`);
    }
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    this.logger.debug(`Final: ${absX}, ${absY}`);
    return `${absX + absY}`;
  }
}
