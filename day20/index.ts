import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day20(logger, testMode);
}

enum Orientation {
  North,
  East,
  South,
  West,
}

const SIDES = [Orientation.North, Orientation.South, Orientation.East, Orientation.West];

interface Tile {
  id: number;
  borders: {
    [Orientation.North]: string;
    [Orientation.South]: string;
    [Orientation.East]: string;
    [Orientation.West]: string;
  };
}

interface Coordinate {
  x: number;
  y: number;
}

interface PlacementObj extends Coordinate {
  orientation: Orientation;
  flipped: boolean;
}
type Placements = Map<number, PlacementObj>;

class Day20 extends Day {
  assertRotCorrect() {
    const run = (or: Orientation) => {
      const arr = [
        this.rotateBy(or, Orientation.North),
        this.rotateBy(or, Orientation.East),
        this.rotateBy(or, Orientation.South),
        this.rotateBy(or, Orientation.West),
      ];
      this.logger.info(`${Orientation[or]}: ${arr.map(x => Orientation[x]).join(', ')}`);
    };

    run(Orientation.North);
    run(Orientation.East);
    run(Orientation.South);
    run(Orientation.West);
  }

  async part1(input: string[]): Promise<string> {
    // this.assertRotCorrect();
    const tiles = this.parseTiles(input);
    const firstTile = tiles[0];
    const startPlacement = new Map<number, PlacementObj>();
    startPlacement.set(firstTile.id, {x: 0, y: 0, orientation: Orientation.North, flipped: false});
    const squareSize = Math.sqrt(tiles.length);

    const result = this.recurse(firstTile, tiles, startPlacement, squareSize);
    if (!result) {
      this.logger.error(`No placements could be found`);
      return 'error';
    }

    this.printTiles(squareSize, result);
    return '';
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }

  private recurse(currentTile: Tile, allTiles: Tile[], placements: Placements, squareSize: number): Placements | null {
    if (placements.size === allTiles.length) {
      return placements;
    }
    // Used for pretty-printing debug statements
    const spaces = Array(placements.size).fill('').join('  ');

    this.logger.debug(`${spaces}Attempting to find matches for ${currentTile.id} (depth ${placements.size})`);

    const newPlacements = new Map(placements);

    const searchingTiles = allTiles.filter(t => !newPlacements.has(t.id));

    const currentPlacement = placements.get(currentTile.id)!!;
    const currentBounds = this.placementBounds(placements);
    const width = currentBounds.maxX - currentBounds.minX;
    const height = currentBounds.maxY - currentBounds.minY;
    const boundX = width === squareSize;
    const boundY = height === squareSize;

    const availableSides = SIDES.filter(side => {
      switch (side) {
        case Orientation.North:
          return !boundY || currentPlacement.y < currentBounds.maxY;
        case Orientation.South:
          return !boundY || currentPlacement.y > currentBounds.minY;
        case Orientation.East:
          return !boundX || currentPlacement.x < currentBounds.maxX;
        case Orientation.West:
          return !boundX || currentPlacement.x > currentBounds.minX;
      }
    });

    this.logger.debug(
      `${spaces}Available sides for ${currentTile.id}: ${availableSides.map(x => Orientation[x]).join(', ')}`
    );

    for (const side of availableSides) {
      this.logger.debug(`${spaces}Looking for tiles on ${Orientation[side]} side of ${currentTile.id}`);
      for (const search of searchingTiles) {
        const matchingSides = this.compareTile(currentTile, side, search, newPlacements);
        for (const match of matchingSides) {
          const coords = this.coordOnSide(currentTile, newPlacements, side);
          if (this.coordExists(coords, newPlacements)) {
            continue;
          }
          this.logger.debug(
            `${spaces}Tile ${search.id} rotated ${Orientation[match.orientation]}${
              match.flipped ? ' flipped' : ''
            } fits on ${Orientation[side]} of tile ${currentTile.id}`
          );
          const newPlace: PlacementObj = {
            ...coords,
            ...match,
          };
          newPlacements.set(search.id, newPlace);
          this.logger.debug(
            `${spaces}Recursing to ${search.id} after placing it at ${coords.x}, ${coords.y} (${
              Orientation[match.orientation]
            }${match.flipped ? ' flipped' : ''})`
          );
          const tryChildPlacement = this.recurse(search, allTiles, newPlacements, squareSize);
          if (tryChildPlacement) {
            this.logger.debug(`${spaces}Found placement for ${search.id} at ${coords.x}, ${coords.y}`);
            return tryChildPlacement;
          } else {
            this.logger.debug(`${spaces}Could not find placement for ${search.id}, continuing`);
          }
        }
      }
    }

    return null;
  }

  private placementBounds(
    placement: Placements
  ): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const placementEntries = Array.from(placement.entries());
    const placementX = placementEntries.map(x => x[1].x);
    const placementY = placementEntries.map(y => y[1].y);
    return {
      minX: Math.min(...placementX),
      maxX: Math.max(...placementX),
      minY: Math.min(...placementY),
      maxY: Math.max(...placementY),
    };
  }

  private printTiles(size: number, placement: Placements) {
    const bounds = this.placementBounds(placement);
    const placementEntries = Array.from(placement.entries());
    if (bounds.maxX - bounds.minX > size) {
      this.logger.warn('X larger than square');
    }
    if (bounds.maxY - bounds.minY > size) {
      this.logger.warn('Y larger than square');
    }
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      const line = [];
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const found = placementEntries.find(entry => entry[1].x === x && entry[1].y === y);
        if (found) {
          line.push(`${found[0]} (${found[1].x.toString().padStart(2)},${found[1].y.toString().padStart(2)})`);
        } else {
          line.push('    null    ');
        }
      }
      this.logger.info(line.join('  '));
    }
  }

  private coordExists(coord: Coordinate, placements: Placements): boolean {
    for (const val of placements.values()) {
      if (val.x === coord.x && val.y === coord.y) {
        return true;
      }
    }
    return false;
  }

  private coordOnSide(tile: Tile, placement: Placements, side: Orientation): Coordinate {
    const p = placement.get(tile.id);
    if (!p) {
      throw Error(`Tried to get the coord for T${tile.id}, but not set in the placement`);
    }

    switch (side) {
      case Orientation.North:
        return {x: p.x, y: p.y + 1};
      case Orientation.South:
        return {x: p.x, y: p.y - 1};
      case Orientation.West:
        return {x: p.x - 1, y: p.y};
      case Orientation.East:
        return {x: p.x + 1, y: p.y};
    }
  }

  private rotateBy(orientation: Orientation, by: Orientation): Orientation {
    return (orientation + by) % 4;
  }

  private compareTile(
    mainTile: Tile,
    side: Orientation,
    otherTile: Tile,
    placement: Placements
  ): {orientation: Orientation; flipped: boolean}[] {
    const mainPlacement = placement.get(mainTile.id);
    if (!mainPlacement) {
      throw Error(`Tried to get the coord for T${mainTile.id}, but not set in the placement`);
    }

    const rotSide = this.rotateBy(side, mainPlacement.orientation);
    let tileSide = mainTile.borders[rotSide];
    if (mainPlacement.flipped) {
      tileSide.split('').reverse().join('');
    }
    const possibleOrientations = [];
    for (const otherSide of SIDES) {
      if (tileSide === otherTile.borders[otherSide]) {
        possibleOrientations.push({orientation: otherSide, flipped: false});
      } else if (tileSide === otherTile.borders[otherSide].split('').reverse().join('')) {
        possibleOrientations.push({orientation: otherSide, flipped: true});
      }
    }
    return possibleOrientations;
  }

  private parseTiles(input: string[]): Tile[] {
    const tileLines: string[] = [];
    const tiles: Tile[] = [];
    for (const line of input) {
      if (line === '') {
        const tile: Tile = {
          id: -1,
          borders: {
            [Orientation.North]: '',
            [Orientation.South]: '',
            [Orientation.East]: '',
            [Orientation.West]: '',
          },
        };
        const tileRegex = /Tile (\d+):/;
        const match = tileRegex.exec(tileLines[0]);
        if (match) {
          tile.id = +match[1];
          tileLines.shift();
        } else {
          throw new Error('Unable to parse tile title: ' + tileLines[0]);
        }
        tile.borders[Orientation.North] = tileLines[0];
        tile.borders[Orientation.South] = tileLines[9];
        tile.borders[Orientation.West] = tileLines.map(l => l[0]).join('');
        tile.borders[Orientation.East] = tileLines.map(l => l[9]).join('');
        tiles.push(tile);
        while (tileLines.length) {
          tileLines.pop();
        }
      } else {
        tileLines.push(line);
      }
    }
    return tiles;
  }
}
