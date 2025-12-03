# pizza-validator

A TypeScript + Zod library for validating pizza objects, with a built-in CLI.

## Installation

As a dependency:

```bash
npm install pizza-validator

import { validatePizza } from "pizza-validator";

const result = validatePizza({
  size: 12,
  crust: "normal",
  toppings: ["cheese", "pepperoni"]
});

if (result.isPizza) {
  console.log("Crust:", result.pizza.crust);
  console.log("Size:", result.pizza.size);
} else {
  console.log("Errors:", result.errors);
}
```
