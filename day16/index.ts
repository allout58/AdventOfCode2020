import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day16(logger, testMode);
}

interface Rule {
  name: string;
  ranges: {
    start: number;
    end: number;
  }[];
  possiblePositions: number[];
  position?: number;
}

class Day16 extends Day {
  async part1(input: string[]): Promise<string> {
    const rulesStr: string[] = [];
    let selfTicketStr: string = '';
    const otherTicketsStr: string[] = [];
    let section = 0;
    for (const line of input) {
      if (line === '') {
        section++;
        continue;
      }
      if (section === 0) {
        rulesStr.push(line);
      } else if (section === 1) {
        if (line === 'your ticket:') {
          continue;
        }
        selfTicketStr = line;
      } else if (section === 2) {
        if (line === 'nearby tickets:') {
          continue;
        }
        otherTicketsStr.push(line);
      }
    }

    const rules: Rule[] = rulesStr.map(line => {
      const [name, rangesStr] = line.split(': ');
      const rangesArr = rangesStr.split(' or ');
      const ranges = rangesArr.map(r => {
        const [start, end] = r.split('-').map(x => +x);
        return {start, end};
      });
      return {name, ranges, possiblePositions: []} as Rule;
    });

    let errorScanRate = 0;
    for (const nearbyTicketStr of otherTicketsStr) {
      this.logger.debug('=== Ticket ===');
      const nearbyTicket = nearbyTicketStr.split(',').map(x => +x);
      for (const num of nearbyTicket) {
        const validForSomeRule = rules.some(rule => this.ruleValid(rule, num));
        if (!validForSomeRule) {
          this.logger.debug(`\t${num} not valid for any rule`);
          errorScanRate += num;
        }
      }
    }

    return `${errorScanRate}`;
  }

  async part2(input: string[]): Promise<string> {
    const rulesStr: string[] = [];
    let selfTicketStr: string = '';
    const otherTicketsStr: string[] = [];
    let section = 0;
    for (const line of input) {
      if (line === '') {
        section++;
        continue;
      }
      if (section === 0) {
        rulesStr.push(line);
      } else if (section === 1) {
        if (line === 'your ticket:') {
          continue;
        }
        selfTicketStr = line;
      } else if (section === 2) {
        if (line === 'nearby tickets:') {
          continue;
        }
        otherTicketsStr.push(line);
      }
    }

    const rules: Rule[] = rulesStr.map(line => {
      const [name, rangesStr] = line.split(': ');
      const rangesArr = rangesStr.split(' or ');
      const ranges = rangesArr.map(r => {
        const [start, end] = r.split('-').map(x => +x);
        return {start, end};
      });
      return {name, ranges, possiblePositions: []} as Rule;
    });

    for (const nearbyTicketStr of otherTicketsStr) {
      this.logger.debug('=== Ticket ===');
      const nearbyTicket = nearbyTicketStr.split(',').map(x => +x);
      if (!nearbyTicket.every(num => rules.some(rule => this.ruleValid(rule, num)))) {
        this.logger.debug(`Skipping ${nearbyTicketStr}, some element matched no rules`);
        continue;
      }
      for (const rule of rules) {
        const inPossibleSpots =
          rule.possiblePositions.length > 0
            ? rule.possiblePositions
            : Array(nearbyTicket.length)
                .fill(0)
                .map((value, index) => index);
        const outPossibleSpots: number[] = [];
        for (const spot of inPossibleSpots) {
          if (this.ruleValid(rule, nearbyTicket[spot])) {
            outPossibleSpots.push(spot);
          }
        }
        rule.possiblePositions = outPossibleSpots;
      }
    }

    const ruleSortFn = (a: Rule, b: Rule) => a.possiblePositions.length - b.possiblePositions.length;

    const rulesLeft = [...rules].sort(ruleSortFn);
    while (rulesLeft.length > 0) {
      const lookingRule = rulesLeft.shift() as Rule;
      if (lookingRule.possiblePositions.length === 1) {
        lookingRule.position = lookingRule.possiblePositions[0];
        rulesLeft.forEach(r => (r.possiblePositions = r.possiblePositions.filter(n => n != lookingRule.position)));
      }
      rulesLeft.sort(ruleSortFn);
    }

    this.logger.debug(`Rule Locations:\n\t${rules.map(r => `${r.name}: ${r.position}`).join('\n\t')}`);
    const departureRules = rules.filter(r => r.name.includes('departure'));
    const myTicket = selfTicketStr.split(',').map(x => +x);
    const departureFields = departureRules.map(r => myTicket[r.position ?? 0]);
    const departureMulti = departureFields.reduce((a, b) => a * b, 1);
    return `${departureMulti}`;
  }

  private ruleValid(rule: Rule, num: number): boolean {
    const ruleValid = rule.ranges.some(range => num >= range.start && num <= range.end);
    this.logger.debug(`Rule ${rule.name} on number ${num}: ${ruleValid ? 'valid' : 'invalid'}`);
    return ruleValid;
  }
}
