// TypeScript compilation and usage test
const predictDataTypes = require('./index');

// Test basic usage - should compile without errors
const basicResult = predictDataTypes('John, 30, true, john@example.com');
console.log('Basic types:', basicResult);

// Test with header mode
const csvData = 'name,age,active,email\nJohn,30,true,john@example.com';
const csvResult = predictDataTypes(csvData, true);
console.log('CSV with headers:', csvResult);

// Test TypeScript type checking
const userName: string = basicResult['John']; // Should be valid
const userAge: string = basicResult['30']; // Should be valid
const userActive: string = basicResult['true']; // Should be valid
const userEmail: string = basicResult['john@example.com']; // Should be valid

console.log('TypeScript compilation successful!');
console.log(`User: ${userName}, Age type: ${userAge}, Active: ${userActive}, Email type: ${userEmail}`);
