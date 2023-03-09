# Predict Data Types

A simple npm package that predicts data types for comma-separated values, including JSON objects, and validates URLs, phone numbers, email addresses, and geolocation data within string values.

## Installation

```bash
npm install predict-data-types

```

## Supported data types
- boolean
- string
- number (decimal and integers are mapped to a number) // TODO improvement for specific data type
- email
- phone number
- url
- array (recursive check)
- object 

## Usage
``` js
const predictDataTypes = require('predict-data-types');

const text = 'John, 123 Main St, john@example.com, 555-555-5555, {"name": "John", "age": 30}, http://example.com';

const types = predictDataTypes(text);

console.log(types);

{
  'John': 'string',
  '123 Main St': 'string',
  'john@example.com': 'email',
  '555-555-5555': 'phone',
  '{"name": "John", "age": 30}': 'object',
  'http://example.com': 'url'
}

```