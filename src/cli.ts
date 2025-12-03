#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { validatePizza } from './index';

function main(): void {
  const { values, positionals } = parseArgs({
    options: {
      file: {
        type: 'string',
        short: 'f',
      },
    },
    allowPositionals: true,
  });

  const filePath = values.file ?? positionals[0];

  if (!filePath) {
    console.error('Usage: pizza-validator --file <path/to/pizza.json>');
    process.exit(1);
  }

  const absolutePath = resolve(filePath);

  let raw: string;
  try {
    raw = readFileSync(absolutePath, 'utf8');
  } catch (err) {
    console.error(`Error: could not read file "${absolutePath}".`);
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
    return;
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Error: file "${absolutePath}" does not contain valid JSON.`);
    if (err instanceof Error) {
      console.error(err.message);
    }
    process.exit(1);
    return;
  }

  const result = validatePizza(data);

  if (result.isPizza) {
    console.log('✅ Valid pizza!');
    console.log(`Size: ${result.pizza.size}"`);
    console.log(`Crust: ${result.pizza.crust}`);
    console.log(`Deep dish: ${result.pizza.isDeepDish}`);
    console.log(`Toppings: ${result.pizza.toppings?.join(', ') ?? 'none'}`);
  } else {
    console.log('❌ Invalid pizza.');
    console.log('Reasons:');
    for (const error of result.errors) {
      console.log(`- ${error}`);
    }
    process.exit(1);
  }
}

main();
