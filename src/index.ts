import { z } from 'zod';

// Toppings that should NEVER be allowed on pizza
export const FORBIDDEN_TOPPINGS = ['glass', 'nails', 'soap', 'toothpaste'] as const;

// Zod schema for validating a pizza
export const pizzaSchema = z.object({
  size: z
    .number()
    .min(6, 'size must be at least 6 inches')
    .max(36, 'size must be at most 36 inches'),

  crust: z.enum(['stuffed', 'normal']),

  isDeepDish: z.boolean().optional().default(false),

  toppings: z
    .array(z.string())
    .optional()
    .refine(
      (toppings) => {
        if (!toppings) return true;

        return !toppings.some((topping) =>
          FORBIDDEN_TOPPINGS.includes(topping as (typeof FORBIDDEN_TOPPINGS)[number]),
        );
      },
      {
        message: 'toppings contain forbidden items',
      },
    ),
});

// Infer a real TypeScript type from the Zod schema
export type Pizza = z.infer<typeof pizzaSchema>;

// Discriminated union return type
export type PizzaValidationResult =
  | {
      isPizza: true;
      pizza: Pizza;
    }
  | {
      isPizza: false;
      errors: string[];
    };

// Main validation function
export function validatePizza(input: unknown): PizzaValidationResult {
  const result = pizzaSchema.safeParse(input);

  if (result.success) {
    return {
      isPizza: true,
      pizza: result.data,
    };
  }

  const errors = result.error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return {
    isPizza: false,
    errors,
  };
}
