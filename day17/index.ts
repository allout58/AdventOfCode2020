import {Consola} from 'consola';
import {Day} from '../utils/day';
import {existsSync, promises} from 'fs';

export default function (logger: Consola, testMode: boolean) {
  return new Day17(logger, testMode);
}

class Day17 extends Day {
  async part1(input: string[]): Promise<string> {
    if (existsSync('day17/out.txt')) {
      await promises.unlink('day17/out.txt');
    }
    let lastState = new Map<string, boolean>();
    const inputNoEmpty = input.filter(l => l != '');
    let lowX = 0;
    let highX = inputNoEmpty[0].length - 1;
    let lowY = 0;
    let highY = inputNoEmpty.length - 1;
    let lowZ = 0;
    let highZ = 0;
    for (let y = 0; y < inputNoEmpty.length; y++) {
      const line = inputNoEmpty[y];
      for (let x = 0; x < line.length; x++) {
        lastState.set(`${x},${y},0`, line[x] === '#');
      }
    }
    const out = [`Before any cycles`, ''];
    for (let z = lowZ; z <= highZ; z++) {
      out.push(`z=${z}`);
      out.push(`(${lowX},${lowY})`);
      for (let y = lowY; y <= highY; y++) {
        let line = [];
        for (let x = lowX; x <= highX; x++) {
          if (lastState.get(`${x},${y},${z}`)) {
            line.push('#');
          } else {
            line.push('.');
          }
        }
        out.push(line.join(''));
      }
      out.push(`\t\t(${highX},${highY})`);
      out.push('');
    }
    await promises.writeFile('day17/out.txt', out.join('\n'), {flag: 'a'});

    for (let cycle = 0; cycle < 1; cycle++) {
      this.logger.debug(`Cycle ${cycle}`);
      highX++;
      highY++;
      highZ++;
      lowX--;
      lowY--;
      lowZ--;
      let currentState = new Map<string, boolean>(lastState);
      for (let z = lowZ; z <= highZ; z++) {
        for (let y = lowY; y <= highY; y++) {
          for (let x = lowX; x <= highX; x++) {
            const isActive = lastState.get(`${x},${y},${z}`) ?? false;

            let activeNeighbors = 0;
            for (let dZ = -1; dZ <= 1; dZ++) {
              for (let dY = -1; dY <= 1; dY++) {
                for (let dX = -1; dX <= 1; dX++) {
                  if (lastState.get(`${x + dX},${y + dY},${z + dZ}`) ?? false) {
                    activeNeighbors++;
                  }
                }
              }
            }

            if (isActive) {
              if (!(activeNeighbors === 2 || activeNeighbors === 3)) {
                currentState.set(`${x},${y},${z}`, false);
              }
            } else {
              if (activeNeighbors === 3) {
                currentState.set(`${x},${y},${z}`, true);
              }
            }
          }
        }
      }
      const out = ['', `After ${cycle + 1} cycle(s)`, ''];
      for (let z = lowZ; z <= highZ; z++) {
        out.push(`z=${z}`);
        out.push(`(${lowX},${lowY})`);
        for (let y = lowY; y <= highY; y++) {
          let line = [];
          for (let x = lowX; x <= highX; x++) {
            if (currentState.get(`${x},${y},${z}`)) {
              line.push('#');
            } else {
              line.push('.');
            }
          }
          out.push(line.join(''));
        }
        out.push(`\t\t(${highX},${highY})`);
        out.push('');
      }
      await promises.writeFile('day17/out.txt', out.join('\n'), {flag: 'a'});
      lastState = currentState;
    }
    const activeCells = Array.from(lastState.values()).filter(x => x).length;
    return `${activeCells}`;
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }
}
