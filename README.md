# Predict Data Types

[![npm version](https://img.shields.io/npm/v/predict-data-types.svg)](https://www.npmjs.com/package/predict-data-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight and robust npm package that automatically predicts data types for comma-separated values, including JSON objects, and validates URLs, phone numbers, email addresses, UUIDs, dates, and more within string values.

## ✨ Features

- 🎯 **Automatic Type Detection**: Intelligently identifies 9+ data types
- 🔒 **Input Validation**: Robust error handling and input validation  
- 📊 **CSV Support**: Parse CSV-like data with optional headers
- 🚀 **Lightweight**: Minimal dependencies (only dayjs)
- 📝 **Well Tested**: Comprehensive test suite with edge cases
- 🔧 **TypeScript Ready**: (Coming soon) Type definitions included
- ⚡ **Fast**: Optimized tokenization and regex patterns

## 📦 Installation

```bash
npm install predict-data-types
```

## 🔧 Supported Data Types

| Type | Description | Examples |
|------|-------------|----------|
| `string` | Plain text values | `'John'`, `'Hello World'` |
| `number` | Integers and decimals | `42`, `3.14`, `-17`, `1e10` |
| `boolean` | Boolean representations | `true`, `false`, `yes`, `no` |
| `email` | Valid email addresses | `user@example.com`, `test+tag@domain.co.uk` |
| `phone` | Phone numbers | `555-555-5555`, `(555) 555-5555`, `+1 555-555-5555` |
| `url` | Web URLs | `https://example.com`, `http://subdomain.site.co.uk/path` |
| `uuid` | UUID v1-v5 | `550e8400-e29b-41d4-a716-446655440000` |
| `date` | Various date formats | `2023-12-31`, `31/12/2023`, `2023-12-31T23:59:59Z` |
| `array` | JSON arrays | `[1, 2, 3]`, `["apple", "banana"]` |
| `object` | JSON objects | `{"name": "John", "age": 30}` |

## 🚀 Usage

### Basic Usage

```javascript
const predictDataTypes = require('predict-data-types');

const text = 'John, 30, true, john@example.com, 2023-01-01';
const types = predictDataTypes(text);

console.log(types);
// Output:
// {
//   'John': 'string',
//   '30': 'number', 
//   'true': 'boolean',
//   'john@example.com': 'email',
//   '2023-01-01': 'date'
// }
```

### Advanced Examples

#### CSV-like Data with Headers

```javascript
const csvData = `name,age,active,email,signup_date
John,30,true,john@example.com,2023-01-01
Jane,25,false,jane@example.com,2023-02-15`;

const types = predictDataTypes(csvData, true); // true = first row is header
console.log(types);
// Output:
// {
//   'name': 'string',
//   'age': 'number',
//   'active': 'boolean', 
//   'email': 'email',
//   'signup_date': 'date'
// }
```

#### Mixed Complex Data

```javascript
const complexData = `
  user@test.com,
  555-123-4567,
  https://github.com/user/repo,
  550e8400-e29b-41d4-a716-446655440000,
  {"settings": {"theme": "dark"}},
  [1, 2, 3, 4, 5]
`;

const types = predictDataTypes(complexData);
console.log(types);
// Output:
// {
//   'user@test.com': 'email',
//   '555-123-4567': 'phone',
//   'https://github.com/user/repo': 'url',
//   '550e8400-e29b-41d4-a716-446655440000': 'uuid',
//   '{"settings": {"theme": "dark"}}': 'object',
//   '[1, 2, 3, 4, 5]': 'array'
// }
```

#### Date Format Detection

```javascript
const dates = '2023-12-31, 31/12/2023, 2023-12-31T23:59:59Z, Dec-31-2023';
const types = predictDataTypes(dates);

console.log(types);
// Output:
// {
//   '2023-12-31': 'date',
//   '31/12/2023': 'date', 
//   '2023-12-31T23:59:59Z': 'date',
//   'Dec-31-2023': 'date'
// }
```

## 📚 API Reference

### `predictDataTypes(input, firstRowIsHeader)`

**Parameters:**
- `input` (string): The comma-separated string to analyze
- `firstRowIsHeader` (boolean, optional): Whether to treat the first row as column headers (default: `false`)

**Returns:** 
- `Object<string, string>`: Mapping of field names/values to their predicted data types

**Throws:**
- `Error`: When input is null, undefined, or not a string

**Supported Date Formats:**
- ISO 8601: `2023-12-31T23:59:59Z`
- Standard: `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`
- With time: `YYYY-MM-DD HH:mm:ss`
- Month names: `DD-MMM-YYYY`, `MMM-DD-YYYY`

## ⚠️ Error Handling

The package includes robust error handling:

```javascript
// These will throw errors
try {
  predictDataTypes(null);      // Error: Input cannot be null or undefined
  predictDataTypes(123);       // Error: Input must be a string
  predictDataTypes([1,2,3]);   // Error: Input must be a string
} catch (error) {
  console.error(error.message);
}

// These will return empty object or appropriate results
predictDataTypes('');          // Returns: {}
predictDataTypes('   ');       // Returns: { '': 'string' }
```

## 🧪 Development

### Running Tests

```bash
npm test        # Run all tests
npm run lint    # Check code quality
npm run lint:fix # Auto-fix lint issues
```

### Test Coverage

The package includes comprehensive tests covering:
- ✅ All supported data types
- ✅ Edge cases and error conditions  
- ✅ Input validation
- ✅ Complex nested structures
- ✅ Various date formats
- ✅ Header mode functionality

## 📝 Changelog

### v1.1.0
- ✅ Fixed UUID pattern variable name bug
- ✅ Replaced deprecated moment.js with dayjs
- ✅ Added comprehensive input validation
- ✅ Fixed security vulnerabilities
- ✅ Added ESLint configuration
- ✅ Enhanced test coverage
- ✅ Added JSDoc documentation
- ✅ Improved README documentation

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`) 
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](README.md)
- �️ [Roadmap](ROADMAP.md) - Planned features and improvements
- �🐛 [Issue Tracker](https://github.com/melihbirim/predict-data-types/issues)  
- 💬 [Discussions](https://github.com/melihbirim/predict-data-types/discussions)

---

Made with ❤️ by [Melih Birim](https://github.com/melihbirim)