import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day4(logger);
}

const tokens = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

class Day4 extends Day {
  part1(input: string[]): string {
    let currentTokens: string[] = [];
    let validPassports = 0;
    for (const line of input) {
      if (line === '') {
        this.logger.debug(`Tokens: ${currentTokens.join(',')}`);
        if (tokens.every(x => currentTokens.includes(x))) {
          validPassports++;
        }
        currentTokens = [];
      } else {
        currentTokens.push(...line.split(' ').map(x => x.split(':')[0]));
      }
    }

    return `${validPassports}`;
  }

  part2(input: string[]): string {
    const validators = {
      byr: (val: string) => {
        const nVal = +val;
        return nVal >= 1920 && nVal <= 2002;
      },
      iyr: (val: string) => {
        const nVal = +val;
        return nVal >= 2010 && nVal <= 2020;
      },
      eyr: (val: string) => {
        const nVal = +val;
        return nVal >= 2020 && nVal <= 2030;
      },
      hgt: (val: string) => {
        const regex = /(\d+)(in|cm)/.exec(val);
        if (!regex) return false;
        const num = +regex[1];
        const unit = regex[2];
        if (unit === 'cm') {
          return num >= 150 && num <= 193;
        } else {
          return num >= 59 && num <= 76;
        }
      },
      hcl: (val: string) => /#[0-9a-f]{6}/.test(val),
      ecl: (val: string) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(val),
      pid: (val: string) => /\d{9}/.test(val),
      cid: () => false,
    };
    let currentTokens: string[] = [];
    let validPassports = 0;
    for (const line of input) {
      if (line === '') {
        this.logger.debug(`Tokens: ${currentTokens.join(',')}`);
        if (tokens.every(x => currentTokens.includes(x))) {
          validPassports++;
        }
        currentTokens = [];
      } else {
        currentTokens.push(
          ...(line
            .split(' ')
            .map(x => {
              const [token, val] = x.split(':');
              const validator = validators[token as keyof typeof validators];
              if (!validator) {
                this.logger.error(`Unable to find validator for token: ${token}`);
                return null;
              }
              if (validator(val)) {
                this.logger.debug(`${token}:${val} is valid`)
                return token;
              } else {
                return null;
              }
            })
            .filter(x => x != null) as string[])
        );
      }
    }

    return `${validPassports}`;
  }
}
