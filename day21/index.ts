import {Consola} from 'consola';
import {Day} from '../utils/day';

export default function (logger: Consola, testMode: boolean) {
  return new Day21(logger, testMode);
}

class Day21 extends Day {
  async part1(input: string[]): Promise<string> {
    const {totalAllergenMap, ingToAllergenMap, totalIngredientMap} = this.parseInput(input);

    for (const [allergen, total] of totalAllergenMap.entries()) {
      for (const [ing, ingMap] of ingToAllergenMap.entries()) {
        if (!ingMap.has(allergen)) {
          continue;
        }
        const ingCountOfAllergen = ingMap.get(allergen)!!;
        if (ingCountOfAllergen < total) {
          ingMap.delete(allergen);
        }
      }
    }

    const ingredientsNoAllergen = Array.from(ingToAllergenMap.entries())
      .filter(([ing, map]) => map.size === 0)
      .map(([ing]) => ing);

    const counts = ingredientsNoAllergen.map(ing => totalIngredientMap.get(ing)!!);

    this.logger.debug(`Ingredients with no allergens: ${ingredientsNoAllergen.join(', ')} [${counts.join(', ')}]`);

    return `${counts.reduce((a, b) => a + b, 0)}`;
  }

  async part2(input: string[]): Promise<string> {
    const {totalAllergenMap, ingToAllergenMap, totalIngredientMap} = this.parseInput(input);

    for (const [allergen, total] of totalAllergenMap.entries()) {
      for (const [ing, ingMap] of ingToAllergenMap.entries()) {
        if (!ingMap.has(allergen)) {
          continue;
        }
        const ingCountOfAllergen = ingMap.get(allergen)!!;
        if (ingCountOfAllergen < total) {
          ingMap.delete(allergen);
        }
      }
    }

    const ingredientsWithAllergens = Array.from(ingToAllergenMap.entries())
      .filter(([ing, map]) => map.size > 0)
      .sort((a, b) => a[1].size - b[1].size);
    const allergenToIngMap = new Map<string, string>();
    const ingredientQueue = [ingredientsWithAllergens.shift()];
    while (ingredientQueue.length > 0) {
      const [ing, map] = ingredientQueue.pop()!!;
      for (const allergen of allergenToIngMap.keys()) {
        map.delete(allergen);
      }
      const nextItem = ingredientsWithAllergens.shift();
      if (nextItem) {
        ingredientQueue.unshift(nextItem);
      }
      if (map.size != 1) {
        if (ingredientQueue.length === 0) {
          this.logger.error(`Issue processing ${ing}, would put itself back at the top of the queue`);
          break;
        }
        ingredientQueue.unshift([ing, map]);
      } else {
        const allergen = Array.from(map.keys())[0];
        allergenToIngMap.set(allergen, ing);
      }
    }

    const entries = Array.from(allergenToIngMap.entries()).sort(([a1], [a2]) => (a1 > a2 ? 1 : -1));

    return `${entries.map(([allergen, ing]) => ing).join(',')}`;
  }

  private parseInput(
    input: string[]
  ): {
    ingToAllergenMap: Map<string, Map<string, number>>;
    totalAllergenMap: Map<string, number>;
    totalIngredientMap: Map<string, number>;
  } {
    const ingToAllergenMap = new Map<string, Map<string, number>>();
    const totalAllergenMap = new Map<string, number>();
    const totalIngredientMap = new Map<string, number>();
    for (const line of input) {
      if (line === '') {
        continue;
      }
      const [ingredients, knownAllergensStr] = line.split(' (contains ');
      const knownAllergens = knownAllergensStr.substr(0, knownAllergensStr.length - 1).split(', ');
      for (const ing of ingredients.split(' ')) {
        totalIngredientMap.set(ing, (totalIngredientMap.get(ing) ?? 0) + 1);

        if (!ingToAllergenMap.has(ing)) {
          ingToAllergenMap.set(ing, new Map());
        }
        const ingMap = ingToAllergenMap.get(ing)!!;
        for (const allergen of knownAllergens) {
          ingMap.set(allergen, (ingMap.get(allergen) ?? 0) + 1);
        }
      }

      for (const allergen of knownAllergens) {
        totalAllergenMap.set(allergen, (totalAllergenMap.get(allergen) ?? 0) + 1);
      }
    }
    return {ingToAllergenMap, totalAllergenMap, totalIngredientMap};
  }
}
