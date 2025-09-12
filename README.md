# Predict Data Types

A lightweight npm package that predicts data types for comma-separated values, including JSON objects, and validates URLs, phone numbers, email addresses, dates, UUIDs, and more.

## Installation

```bash
npm install predict-data-types
```

## Supported Data Types

- `boolean` - true/false, yes/no, on/off, 1/0 
- `string` - any text that doesn't match other patterns
- `number` - decimal numbers and integers
- `date` - various date formats (ISO, US, European, etc.)
- `email` - email addresses
- `phone` - phone numbers (US format)
- `url` - HTTP/HTTPS URLs
- `uuid` - UUID v1-v5 format
- `array` - JSON arrays (starting with `[` and ending with `]`)
- `object` - JSON objects (starting with `{` and ending with `}`)

## Usage

### Basic Usage

```js
const predictDataTypes = require('predict-data-types');

const text = 'John, 123 Main St, john@example.com, 555-555-5555, {"name": "John", "age": 30}, http://example.com';
const types = predictDataTypes(text);

console.log(types);
// Output:
// {
//   'John': 'string',
//   '123 Main St': 'string', 
//   'john@example.com': 'email',
//   '555-555-5555': 'phone',
//   '{"name": "John", "age": 30}': 'object',
//   'http://example.com': 'url'
// }
```

### With Header Row

```js
const csvData = 'name,age,active,signup_date\nJohn,30,true,2023-01-15';
const types = predictDataTypes(csvData, true);

console.log(types);
// Output:
// {
//   'name': 'string',
//   'age': 'number', 
//   'active': 'boolean',
//   'signup_date': 'date'
// }
```

### Error Handling

```js
try {
  const types = predictDataTypes(null);
} catch (error) {
  console.error(error.message); // "Input must be a string"
}

// Empty strings return empty object
const emptyResult = predictDataTypes(''); // returns {}
```

## API

### `predictDataTypes(str, [firstRowIsHeader])`

**Parameters:**
- `str` (string): The comma-separated string to analyze
- `firstRowIsHeader` (boolean, optional): Whether the first row contains column headers. Default: `false`

**Returns:**
- Object with field names/values as keys and predicted types as values

**Throws:**
- Error if input is not a string

## Examples

### Boolean Detection
```js
predictDataTypes('true,false,yes,no,on,off,1,0');
// All values will be detected as 'boolean'
```

### UUID Detection  
```js
predictDataTypes('123e4567-e89b-12d3-a456-426614174000,regular-text');
// Returns: {'123e4567-e89b-12d3-a456-426614174000': 'uuid', 'regular-text': 'string'}
```

### Mixed Data Types
```js
predictDataTypes('alice@email.com,25,2023-12-01,https://example.com,true');
// Returns: {
//   'alice@email.com': 'email',
//   '25': 'number', 
//   '2023-12-01': 'date',
//   'https://example.com': 'url',
//   'true': 'boolean'
// }
```

## License

MIT