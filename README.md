# Predict Data Types

[![npm version](https://img.shields.io/npm/v/predict-data-types.svg)](https://www.npmjs.com/package/predict-data-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**When users upload CSV or JSON files, everything arrives as strings.**

This library infers the actual data types automatically.

```javascript
const { infer } = require("predict-data-types");

infer("42")
// → 'number'

infer(["true", "false", "true"])
// → 'boolean'

infer({ name: "Alice", age: "25", email: "alice@example.com" })
// → { name: 'string', age: 'number', email: 'email' }

infer([
  { name: "Alice", age: "25" },
  { name: "Bob", age: "30" }
])
// → { name: 'string', age: 'number' }
```

**One smart function. Any input type.**

---

Zero-dependency package for automatic data type detection from strings, arrays, and JSON objects. Detects 14+ data types including primitives, emails, URLs, UUIDs, dates, IPs, colors, percentages, and currency.

## Features

- **Smart Type Inference**: One `infer()` function handles strings, arrays, objects, and arrays of objects
- **14 Data Types**: Primitives plus emails, URLs, UUIDs, dates, IPs, colors, percentages, currency
- **JSON Schema Generation**: Automatically generate JSON Schema from objects (compatible with Ajv, etc.)
- **Type Constants**: Use `DataTypes` for type-safe comparisons instead of string literals
- **CSV Support**: Parse comma-separated values with optional headers
- **Zero Dependencies**: Completely standalone, no external packages
- **TypeScript Support**: Full type definitions included
- **45+ Date Formats**: Comprehensive date parsing including month names and timezones
- **Battle-Tested**: 60 comprehensive test cases

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

### Type Constants (Recommended)

Use `DataTypes` constants instead of string literals for type-safe comparisons:

```javascript
const { infer, DataTypes } = require("predict-data-types");

const type = infer("test@example.com");

// ✅ Type-safe with constants
if (type === DataTypes.EMAIL) {
  console.log("Valid email!");
}

// ❌ Avoid string literals (error-prone)
if (type === 'email') { ... }

// All available constants:
DataTypes.STRING      // 'string'
DataTypes.NUMBER      // 'number'
DataTypes.BOOLEAN     // 'boolean'
DataTypes.EMAIL       // 'email'
DataTypes.PHONE       // 'phone'
DataTypes.URL         // 'url'
DataTypes.UUID        // 'uuid'
DataTypes.DATE        // 'date'
DataTypes.ARRAY       // 'array'
DataTypes.OBJECT      // 'object'
DataTypes.IP          // 'ip'
DataTypes.COLOR       // 'color'
DataTypes.PERCENTAGE  // 'percentage'
DataTypes.CURRENCY    // 'currency'
```

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

### Smart `infer()` Function

The `infer()` function automatically adapts to any input type:

```javascript
const { infer, DataTypes } = require("predict-data-types");

// Single value → DataType
infer("2024-01-01") // → 'date'
infer("test@example.com") // → 'email'
infer("42") // → 'number'

// Array of values → Common DataType
infer(["1", "2", "3"]) // → 'number'
infer(["true", "false", "yes"]) // → 'boolean'

// Object → Schema
infer({ 
  name: "Alice", 
  age: "25", 
  active: "true" 
})
// → { name: 'string', age: 'number', active: 'boolean' }

// Array of objects → Schema
infer([
  { name: "Alice", age: "25", email: "alice@example.com" },
  { name: "Bob", age: "30", email: "bob@example.com" }
])
// → { name: 'string', age: 'number', email: 'email' }
```

### JSON Schema Format

Generate standard JSON Schema for validation libraries (Ajv, etc.):

```javascript
const { infer, Formats } = require("predict-data-types");

const data = {
  name: "Alice",
  age: "25",
  email: "alice@example.com",
  website: "https://example.com"
};

// Simple format (default)
infer(data)
// → { name: 'string', age: 'number', email: 'email', website: 'url' }

// JSON Schema format
infer(data, Formats.JSONSCHEMA)
// → {
//     type: 'object',
//     properties: {
//       name: { type: 'string' },
//       age: { type: 'number' },
//       email: { type: 'string', format: 'email' },
//       website: { type: 'string', format: 'uri' }
//     },
//     required: ['name', 'age', 'email', 'website']
//   }

// Use with validation libraries
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = infer(data, Formats.JSONSCHEMA);
const validate = ajv.compile(schema);
const valid = validate({ name: "Bob", age: 30, email: "bob@example.com", website: "https://bob.dev" });
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

### Real-World Use Cases

**Form Validation**
```javascript
const { infer, DataTypes } = require("predict-data-types");

const formData = {
  email: "user@example.com",
  age: "25",
  website: "https://example.com"
};

const schema = infer(formData);
// { email: 'email', age: 'number', website: 'url' }

// Type-safe validation
if (schema.email !== DataTypes.EMAIL) {
  throw new Error("Invalid email format");
}

const schema = infer(formData);
// Automatically validates field types
```

**API Response Analysis**
```javascript
const apiResponse = [
  { id: "1", created: "2024-01-01", status: "true" },
  { id: "2", created: "2024-01-02", status: "false" }
];

const schema = infer(apiResponse);
// Generate schema for documentation
```

**CSV Import**
```javascript
const csvImport = `id,email,signup_date
1,alice@example.com,2024-01-01
2,bob@example.com,2024-01-02`;

const schema = predictDataTypes(csvImport, true);
// Auto-detect column types for database import
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

### `infer(input)`

**Smart inference for any input type:**

**Parameters:**
- `input` (string | string[] | Object | Object[]): Value(s) to analyze

**Returns:** 
- DataType (string) for primitive values and arrays of primitives
- Schema (Object) for objects and arrays of objects

**Examples:**
```javascript
infer("42")                    // → 'number'
infer(["1", "2"])              // → 'number'
infer({ age: "25" })           // → { age: 'number' }
infer([{ age: "25" }])         // → { age: 'number' }
```

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

