import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day22(logger, testMode);
}

class Day22 extends Day {
  nextGame = 1;
  p2FinalWinner: number[] = [];

  async part1(input: string[]): Promise<string> {
    // this.logger.level = LogLevel.Info;
    // const {player1, player2} = this.parseInput(input);
    //
    // let round = 1;
    // while (player1.length > 0 && player2.length > 0) {
    //   this.logger.debug(`-- Round ${round++} --`);
    //   this.logger.debug(`Player 1's deck: ${player1.join(', ')}`);
    //   this.logger.debug(`Player 2's deck: ${player2.join(', ')}`);
    //   const p1Top = player1.shift()!!;
    //   const p2Top = player2.shift()!!;
    //   this.logger.debug(`Player 1 plays: ${p1Top}`);
    //   this.logger.debug(`Player 2 plays: ${p2Top}`);
    //   if (p1Top > p2Top) {
    //     this.logger.debug(`Player 1 wins`);
    //     player1.push(p1Top, p2Top);
    //   } else if (p1Top < p2Top) {
    //     this.logger.debug(`Player 2 wins`);
    //     player2.push(p2Top, p1Top);
    //   } else {
    //     this.logger.warn(`Top of both is equal`);
    //   }
    //   this.logger.debug('');
    // }
    //
    // this.logger.debug(`-- Final Result --`);
    // this.logger.debug(`Player 1's deck: ${player1.join(', ')}`);
    // this.logger.debug(`Player 2's deck: ${player2.join(', ')}`);
    //
    // const winner = player1.length > 0 ? player1 : player2;
    // const score = [...winner]
    //   .reverse()
    //   .map((num, index) => num * (index + 1))
    //   .reduce((a, b) => a + b, 0);
    // return `${score}`;
    return '';
  }

  async part2(input: string[]): Promise<string> {
    const {player1, player2} = this.parseInput(input);
    const result = this.recursiveCombat([...player1], [...player2], this.nextGame++);
    this.logger.info(`Final winner is player ${result}`);
    const score = [...this.p2FinalWinner]
      .reverse()
      .map((num, index) => num * (index + 1))
      .reduce((a, b) => a + b, 0);
    return `${score}`;
  }

  private recursiveCombat(player1: number[], player2: number[], game: number): number {
    this.logger.debug('');
    this.logger.info(`=== Game ${game} ===`);
    this.logger.debug('');
    let previousRounds: string[] = [];
    let round = 0;
    while (player1.length > 0 && player2.length > 0) {
      round++;
      this.logger.debug(`-- Round ${round} (Game ${game}) --`);

      const roundString = player1.join(',') + '|' + player2.join(',');
      if (previousRounds.some(r => r == roundString)) {
        this.logger.debug(`Player 1 wins game ${game} by default`);
        // this.logger.debug(`Rounds:\n\t${previousRounds.join('\n\t')}`)
        return 1;
      } else {
        previousRounds.push(roundString);
      }

      this.logger.debug(`Player 1's deck: ${player1.join(', ')}`);
      this.logger.debug(`Player 2's deck: ${player2.join(', ')}`);
      const p1Top = player1.shift()!!;
      const p2Top = player2.shift()!!;
      this.logger.debug(`Player 1 plays: ${p1Top}`);
      this.logger.debug(`Player 2 plays: ${p2Top}`);
      let winner = -1;
      if (p1Top <= player1.length && p2Top <= player2.length) {
        this.logger.debug(`Playing a sub-game to determine the winner...`);
        winner = this.recursiveCombat([...player1].slice(0, p1Top), [...player2].slice(0, p2Top), this.nextGame++);
        this.logger.debug(`...anyway, back to game ${game}`);
      } else {
        if (p1Top > p2Top) {
          winner = 1;
        } else if (p2Top > p1Top) {
          winner = 2;
        }
      }
      if (winner === 1) {
        this.logger.debug(`Player 1 wins round ${round} of game ${game}!`);
        player1.push(p1Top, p2Top);
      } else if (winner === 2) {
        this.logger.debug(`Player 2 wins round ${round} of game ${game}!`);
        player2.push(p2Top, p1Top);
      }
      this.logger.debug('');
    }
    const gameWinner = player1.length > 0 ? 1 : 2;
    this.logger.debug(`The winner of game ${game} is player ${gameWinner}`);
    this.logger.debug('');
    if (game === 1) {
      this.p2FinalWinner = gameWinner === 1 ? player1 : player2;
    }
    return gameWinner;
  }

  private parseInput(input: string[]): {player1: number[]; player2: number[]} {
    const player1: number[] = [];
    const player2: number[] = [];
    let section = 0;
    for (const line of input) {
      if (line.startsWith('Player')) {
        section++;
      } else if (line !== '') {
        switch (section) {
          case 1:
            player1.push(+line);
            break;
          case 2:
            player2.push(+line);
            break;
        }
      }
    }
    return {player1, player2};
  }
}
