import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola) {
  return new Day7(logger);
}

interface Rule {
  color: string;
  children: Array<{
    color: string;
    count: number;
  }>;
}

class Day7 extends Day {
  private shinyGold = 'shiny gold';

  async part1(input: string[]): Promise<string> {
    const lookingColors = [this.shinyGold];
    const rules = this.parseRules(input);
    const foundColors: string[] = [];
    while (lookingColors.length > 0) {
      const thisColor = lookingColors.pop();
      this.logger.debug(`Looking for things that contain: ${thisColor}`);
      const foundRules = rules.filter(r => r.children.find(c => c.color === thisColor) != null);
      const newColors = foundRules.map(r => r.color).filter(x => !foundColors.includes(x));
      this.logger.debug(`New colors: ${newColors.join(', ')}`);
      lookingColors.push(...newColors);
      foundColors.push(...newColors);
    }
    return `${foundColors.length}`;
  }

  async part2(input: string[]): Promise<string> {
    const rules = this.parseRules(input);
    const rulesDictionary: Record<string, Rule> = rules.reduce((dict, curr) => {
      dict[curr.color] = curr;
      return dict;
    }, {} as Record<string, Rule>);
    const ret = this.part2Recurse(this.shinyGold, rulesDictionary);
    return `${ret}`;
  }

  private part2Recurse(color: string, rules: Record<string, Rule>): number {
    const rule = rules[color];
    this.logger.debug(`Finding number of children for color: ${color}`);
    const childPackages = rule.children
      .map(child => child.count * this.part2Recurse(child.color, rules) + child.count)
      .reduce((a, b) => a + b, 0);
    this.logger.debug(`Number of children for ${color}: ${childPackages}`);
    return childPackages ?? 0;
  }

  private parseRules(input: string[]): Array<Rule> {
    const regex = /(\d+) ([a-z ]+) bags?/;
    return input
      .filter(x => !!x)
      .map(line => {
        const [color, contains] = line.replace('.', '').split(' bags contain ');
        if (contains === 'no other bags') {
          return {
            color,
            children: [],
          };
        }
        const containsSplit = contains.split(', ').map(c => {
          const match = regex.exec(c);
          if (match) {
            const [_, count, childColor] = match;
            return {
              color: childColor,
              count: +count,
            };
          } else {
            this.logger.error(`Unable to parse a contains: ${c}`);
            return {color: c, count: 0};
          }
        });
        return {
          color,
          children: containsSplit,
        };
      });
  }
}
