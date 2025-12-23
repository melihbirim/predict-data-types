# Predict Data Types

[![npm version](https://img.shields.io/npm/v/predict-data-types.svg)](https://www.npmjs.com/package/predict-data-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem

**When users upload CSV or JSON files, everything arrives as strings.**

TypeScript and JavaScript can't help you here:

```typescript
// ❌ TypeScript only knows static types
const userInput = "test@example.com"; // TypeScript thinks: string
const csvValue = "2024-01-01"; // TypeScript thinks: string
const formData = "42"; // TypeScript thinks: string

// TypeScript CANNOT detect these are email, date, and number at runtime
```

**This library solves that problem with runtime type detection:**

```javascript
const { infer } = require("predict-data-types");

infer("test@example.com"); // → 'email' ✅
infer("2024-01-01"); // → 'date' ✅
infer("42"); // → 'number' ✅
infer('11:59 PM'); // → 'time' ✅
infer(["true", "false", "true"]);
// → 'boolean' ✅

infer({ name: "Alice", age: "25", email: "alice@example.com" });
// → { name: 'string', age: 'number', email: 'email' } ✅

infer([
  { name: "Alice", age: "25" },
  { name: "Bob", age: "30" },
]);
// → { name: 'string', age: 'number' } ✅
```

**One smart function. Any input type.**

---

Zero-dependency package for automatic data type detection from strings, arrays, and JSON objects. Detects 15 data types including primitives, emails, URLs, UUIDs, dates, IPs, colors, percentages, currency, and mentions.

> **💡 Important:** This library performs **runtime type detection** on string values, not static type checking. TypeScript is a compile-time type system for your code structure - this library analyzes actual data content at runtime. They solve completely different problems!

## Features

- **Smart Type Inference**: One `infer()` function handles strings, arrays, objects, and arrays of objects
- **15 Data Types**: Primitives plus emails, URLs, UUIDs, dates, IPs, colors, percentages, currency, mentions
- **JSON Schema Generation**: Automatically generate JSON Schema from objects (compatible with Ajv, etc.)
- **Type Constants**: Use `DataTypes` for type-safe comparisons instead of string literals
- **CSV Support**: Parse comma-separated values with optional headers
- **Zero Dependencies**: Completely standalone, no external packages
- **TypeScript Support**: Full type definitions included
- **45+ Date Formats**: Comprehensive date parsing including month names and timezones
- **Battle-Tested**: 68 comprehensive test cases

## Installation

```bash
npm install predict-data-types
```

## Quick Examples

Real-world use cases showing what you can build:

**📊 CSV Import Tool**
```javascript
// Auto-detect column types and transform data
const employees = parseCSV(file); // All values are strings
const schema = infer(employees);
// → { name: 'string', email: 'email', salary: 'currency', hire_date: 'date' }
```

**🎨 Form Builder**
```javascript
// Auto-generate form fields with correct input types
const userData = { email: 'alice@example.com', age: '25', website: 'https://alice.dev' };
const types = infer(userData);
// → { email: 'email', age: 'number', website: 'url' }
// Generate: <input type="email">, <input type="number">, <input type="url">
```

**🌐 API Analyzer**
```javascript
// Generate JSON Schema and TypeScript interfaces from API responses
const response = await fetch('/api/users').then(r => r.json());
const jsonSchema = infer(response, Formats.JSONSCHEMA);
// Use with Ajv, joi, or generate TypeScript types
```

**✅ Data Validator**
```javascript
// Validate imported data quality
const expected = { email: DataTypes.EMAIL, age: DataTypes.NUMBER };
const actual = infer(importedData);
// Detect mismatches, missing fields, wrong types
```

👉 **See full runnable examples in [`examples/`](./examples) directory**

## Supported Data Types

| Type         | Examples                                  |
| ------------ |-------------------------------------------|
| `string`     | `'John'`, `'Hello World'`                 |
| `number`     | `42`, `3.14`, `-17`, `1e10`               |
| `boolean`    | `true`, `false`, `yes`, `no`              |
| `email`      | `user@example.com`                        |
| `phone`      | `555-555-5555`, `(555) 555-5555`          |
| `url`        | `https://example.com`                     |
| `uuid`       | `550e8400-e29b-41d4-a716-446655440000`    |
| `date`       | `2023-12-31`, `31/12/2023`                |
| `ip`         | `192.168.1.1`, `2001:0db8::1`             |
| `color`      | `#FF0000`, `#fff`                         |
| `percentage` | `50%`, `-25%`                             |
| `currency`   | `$100`, `€50.99`                          |
| `mention`    | `@username`, `@user_name123`, `@john-doe` |
| `array`      | `[1, 2, 3]`                               |
| `object`     | `{"name": "John"}`                        |
| `time`       | `{"23:59:59": "2:30 p.m."}`                        |


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
DataTypes.MENTION     // 'mention'
DataTypes.TIME        // 'time'

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
infer("2024-01-01"); // → 'date'
infer("12:05 AM"); // → 'time'
infer("test@example.com"); // → 'email'
infer("@username"); // → 'mention'
infer("42"); // → 'number'

// Array of values → Common DataType
infer(["1", "2", "3"]); // → 'number'
infer(["true", "false", "yes"]); // → 'boolean'

// Object → Schema
infer({
  name: "Alice",
  age: "25",
  active: "true",
});
// → { name: 'string', age: 'number', active: 'boolean' }

// Array of objects → Schema
infer([
  { name: "Alice", age: "25", email: "alice@example.com" },
  { name: "Bob", age: "30", email: "bob@example.com" },
]);
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
  website: "https://example.com",
};

// Simple format (default)
infer(data);
// → { name: 'string', age: 'number', email: 'email', website: 'url' }

// JSON Schema format
infer(data, Formats.JSONSCHEMA);
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
const Ajv = require("ajv");
const ajv = new Ajv();

const schema = infer(data, Formats.JSONSCHEMA);
const validate = ajv.compile(schema);
const valid = validate({
  name: "Bob",
  age: 30,
  email: "bob@example.com",
  website: "https://bob.dev",
});
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

## 📚 Complete Examples

The [`examples/`](./examples) directory contains full, runnable code for real-world scenarios:

- **[CSV Import](./examples/csv-import)** - Parse CSV files, auto-detect types, transform data to proper JavaScript types
- **[Form Builder](./examples/form-builder)** - Dynamically generate HTML forms with correct input types and validation
- **[API Analyzer](./examples/api-analyzer)** - Generate JSON Schemas, TypeScript interfaces, and API documentation
- **[Data Validation](./examples/data-validation)** - Validate imported data quality and detect type mismatches

Each example includes:

- ✅ Complete runnable code with detailed comments
- ✅ Real-world use cases and scenarios
- ✅ Sample data files where applicable

**Run any example:**
```bash
cd examples/csv-import
node example.js
```

### Complex Data

- ✅ Sample data files

### Complex Data

```javascript
const { infer } = require('predict-data-types');

const complexString = "192.168.1.1, #FF0000, 50%, $100, 2023-12-31";
const types = infer(complexString.split(', ').map(v => ({ value: v })));
// { value: 'ip' } // Takes the most specific type found

// Or analyze each value separately:
const values = "192.168.1.1, #FF0000, 50%, $100, 2023-12-31".split(', ');
values.forEach(val => {
  console.log(`${val}: ${infer(val)}`);
});
// 192.168.1.1: ip
// #FF0000: color
// 50%: percentage
// $100: currency
// 2023-12-31: date
```

## API

### `infer(input, format?)`

**The main function - handles any input type:**

**Parameters:**

- `input` (string | string[] | Object | Object[]): Value(s) to analyze
- `format` (optional): Output format - `Formats.NONE` (default) or `Formats.JSONSCHEMA`

**Returns:**

- `DataType` (string) - for single values and arrays of values
- `Schema` (Object) - for objects and arrays of objects  
- `JSONSchema` (Object) - when `format` is `Formats.JSONSCHEMA`

**Examples:**

```javascript
const { infer, Formats, DataTypes } = require('predict-data-types');

// Single values
infer("42"); // → 'number'
infer("test@example.com"); // → 'email'

// Arrays
infer(["1", "2", "3"]); // → 'number'

// Objects
infer({ age: "25", email: "test@example.com" });
// → { age: 'number', email: 'email' }

// Arrays of objects
infer([{ age: "25" }, { age: "30" }]);
// → { age: 'number' }

// JSON Schema format
infer({ name: "Alice", age: "25" }, Formats.JSONSCHEMA);
// → { type: 'object', properties: {...}, required: [...] }
```

### Constants

**`DataTypes`** - Type-safe constants for comparisons:
```javascript
DataTypes.STRING, DataTypes.NUMBER, DataTypes.BOOLEAN, DataTypes.EMAIL,
DataTypes.PHONE, DataTypes.URL, DataTypes.UUID, DataTypes.DATE,
DataTypes.IP, DataTypes.COLOR, DataTypes.PERCENTAGE, DataTypes.CURRENCY,
DataTypes.ARRAY, DataTypes.OBJECT
```

**`Formats`** - Output format constants:
```javascript
Formats.NONE        // Default simple schema
Formats.JSONSCHEMA  // JSON Schema format
```

### Legacy API

**`predictDataTypes(input, firstRowIsHeader)`** - For CSV strings only (use `infer()` instead)

<details>
<summary>Show legacy API details</summary>

**Parameters:**
- `input` (string): Comma-separated string to analyze
- `firstRowIsHeader` (boolean): Treat first row as headers (default: `false`)

**Returns:** Object mapping field names/values to their data types

**Example:**
```javascript
const types = predictDataTypes('name,age\nAlice,25', true);
// { name: 'string', age: 'number' }
```

**Note:** This function is maintained for backwards compatibility. New code should use `infer()`.

</details>


## TypeScript vs. This Library

**Common Misconception:** "Doesn't TypeScript already do this?"

**No!** TypeScript and this library serve completely different purposes:

| Feature | TypeScript | This Library |
|---------|-----------|--------------|
| **When it works** | Compile-time | Runtime |
| **What it checks** | Your code structure | Actual data content |
| **Scope** | Static type annotations | Dynamic string analysis |
| **Use case** | Prevent coding errors | Analyze user-provided data |

**Example:**

```typescript
// TypeScript
const value: string = "test@example.com";
// TypeScript knows: "value is a string"
// TypeScript DOESN'T know: "value contains an email address"

// This Library
const type = infer("test@example.com");
// Returns: 'email' ✅
// Detects the ACTUAL CONTENT at runtime
```

**When to use this library:**
- 📊 Users upload CSV/Excel files
- 🌐 API responses with unknown structure  
- 📝 Form data that needs validation
- 🔄 ETL pipelines processing raw data
- 🎨 Dynamic form/UI generation

TypeScript can't help with any of these - you need runtime type detection!

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
