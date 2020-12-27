import {Consola} from 'consola';
import {Day} from '../utils/day';
// This gets around tsc being dumb and not knowing how to find my custom .d.ts file
const jison = require('jison') as any;

export default function (logger: Consola, testMode: boolean) {
  return new Day19(logger, testMode);
}

class Day19 extends Day {
  async part1(input: string[]): Promise<string> {
    const rules: string[] = [];
    const messages: string[] = [];
    let section = 0;
    for (const line of input) {
      if (line === '') {
        section++;
        continue;
      }
      if (section === 0) {
        rules.push(line);
      } else {
        messages.push(line);
      }
    }
    const singleCharacters = rules
      .map(x => {
        const res = /\d+: "([a-z])"/.exec(x);
        if (res) {
          return res[1];
        } else {
          return null;
        }
      })
      .filter(x => x !== null) as string[];

    const parser = new jison.Parser({
      lex: {
        rules: singleCharacters.map(char => [`${char}`, `return '${char}';`]),
      },
      bnf: rules.reduce((dict, rule) => {
        const [name, logic] = rule.split(': ');
        dict[name] = logic.replace(/"([a-z])"/, (sub, p1) => p1).split(' | ');
        return dict;
      }, {} as Record<string, string[]>),
    });

    let matches = 0;

    for (const message of messages) {
      try {
        const tryParse = parser.parse(message);
        if(tryParse) {
          matches++;
        }
        this.logger.debug(`Parse ${message}: ${tryParse}`);
      } catch (err) {
        this.logger.debug(`Parse ${message}: false`);
      }
    }

    return `${matches}`;
  }

  async part2(input: string[]): Promise<string> {
    return '';
  }
}
