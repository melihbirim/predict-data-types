# Predict Data Types

[![npm version](https://img.shields.io/npm/v/predict-data-types.svg)](https://www.npmjs.com/package/predict-data-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight npm package that automatically predicts data types for comma-separated values. Supports 14 data types including primitives, URLs, emails, UUIDs, dates, IP addresses, colors, percentages, and currency.

## Features

- Automatic detection of 14 data types
- CSV parsing with optional headers
- TypeScript definitions included
- Minimal dependencies (only dayjs)
- Comprehensive test coverage
- Optimized regex patterns

## Installation

```bash
npm install predict-data-types
```

## Supported Data Types

| Type | Examples |
|------|----------|
| `string` | `'John'`, `'Hello World'` |
| `number` | `42`, `3.14`, `-17`, `1e10` |
| `boolean` | `true`, `false`, `yes`, `no` |
| `email` | `user@example.com` |
| `phone` | `555-555-5555`, `(555) 555-5555` |
| `url` | `https://example.com` |
| `uuid` | `550e8400-e29b-41d4-a716-446655440000` |
| `date` | `2023-12-31`, `31/12/2023` |
| `ip` | `192.168.1.1`, `2001:0db8::1` |
| `color` | `#FF0000`, `#fff` |
| `percentage` | `50%`, `-25%` |
| `currency` | `$100`, `€50.99` |
| `array` | `[1, 2, 3]` |
| `object` | `{"name": "John"}` |

## Usage

### Basic Example

```javascript
const predictDataTypes = require("predict-data-types");

const text = "John, 30, true, john@example.com, 2023-01-01";
const types = predictDataTypes(text);

console.log(types);
// {
//   'John': 'string',
//   '30': 'number',
//   'true': 'boolean',
//   'john@example.com': 'email',
//   '2023-01-01': 'date'
// }
```

### CSV with Headers

```javascript
const csvData = `name,age,active,email
John,30,true,john@example.com`;

const types = predictDataTypes(csvData, true);
// {
//   'name': 'string',
//   'age': 'number',
//   'active': 'boolean',
//   'email': 'email'
// }
```

### Complex Data

```javascript
const data = "192.168.1.1, #FF0000, 50%, $100, 2023-12-31";
const types = predictDataTypes(data);
// {
//   '192.168.1.1': 'ip',
//   '#FF0000': 'color',
//   '50%': 'percentage',
//   '$100': 'currency',
//   '2023-12-31': 'date'
// }
```

## API

### `predictDataTypes(input, firstRowIsHeader)`

**Parameters:**
- `input` (string): Comma-separated string to analyze
- `firstRowIsHeader` (boolean): Treat first row as headers (default: `false`)

**Returns:** Object mapping field names/values to their data types

**Throws:** Error if input is null, undefined, or not a string

## Development

```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage
npm run lint          # Check code quality
npm run lint:fix      # Fix lint issues
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

Author: [Melih Birim](https://github.com/melihbirim)

