import { validatePizza, FORBIDDEN_TOPPINGS } from '../src/index';

describe('validatePizza', () => {
  test('valid pizza passes', () => {
    const result = validatePizza({
      size: 12,
      crust: 'normal',
      isDeepDish: false,
      toppings: ['cheese', 'pepperoni'],
    });

    expect(result.isPizza).toBe(true);

    if (result.isPizza) {
      expect(result.pizza.size).toBe(12);
      expect(result.pizza.crust).toBe('normal');
    }
  });

  test('missing crust fails', () => {
    const result = validatePizza({
      size: 10,
      toppings: ['cheese'],
    });

    expect(result.isPizza).toBe(false);

    if (!result.isPizza) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  test('forbidden topping fails', () => {
    const badTopping = FORBIDDEN_TOPPINGS[0];

    const result = validatePizza({
      size: 14,
      crust: 'stuffed',
      toppings: ['cheese', badTopping],
    });

    expect(result.isPizza).toBe(false);

    if (!result.isPizza) {
      expect(result.errors.some((e) => e.toLowerCase().includes('forbidden'))).toBe(true);
    }
  });
});
