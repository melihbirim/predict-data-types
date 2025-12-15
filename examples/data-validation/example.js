/**
 * Data Validation Example
 * 
 * This example shows how to validate imported data
 * against expected schema and detect data quality issues.
 */

const { infer, DataTypes } = require('../../index');

// Expected schema for employee data
const expectedSchema = {
    name: DataTypes.STRING,
    email: DataTypes.EMAIL,
    age: DataTypes.NUMBER,
    salary: DataTypes.CURRENCY,
    hireDate: DataTypes.DATE,
    isActive: DataTypes.BOOLEAN
};

console.log('📋 Expected Schema:');
console.log(expectedSchema);
console.log();

// Test Case 1: Valid data
const validData = [
    {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        age: '28',
        salary: '$75000',
        hireDate: '2024-01-15',
        isActive: 'true'
    }
];

// Test Case 2: Invalid data (email is malformed)
const invalidData = [
    {
        name: 'Bob Smith',
        email: 'not-an-email',
        age: '35',
        salary: '$95000',
        hireDate: '2023-06-20',
        isActive: 'true'
    }
];

// Test Case 3: Inconsistent types
const inconsistentData = [
    { name: 'Carol', email: 'carol@co.com', age: '42', salary: '$100k', hireDate: '2022-01-01', isActive: 'yes' },
    { name: 'Dave', email: 'dave@co.com', age: 'thirty', salary: '80000', hireDate: 'Jan 15 2023', isActive: 'true' }
];

function validateData(data, expectedSchema) {
    console.log('\n🔍 Validating data...\n');
    
    const detectedSchema = infer(data);
    const errors = [];
    const warnings = [];
    
    // Check schema match
    for (const [field, expectedType] of Object.entries(expectedSchema)) {
        const detectedType = detectedSchema[field];
        
        if (!detectedType) {
            errors.push(`Missing field: ${field}`);
        } else if (detectedType !== expectedType) {
            errors.push(`Field "${field}": expected ${expectedType}, got ${detectedType}`);
        }
    }
    
    // Check for extra fields
    for (const field of Object.keys(detectedSchema)) {
        if (!expectedSchema[field]) {
            warnings.push(`Unexpected field: ${field}`);
        }
    }
    
    return { detectedSchema, errors, warnings };
}

// Validate Case 1: Valid data
console.log('=== Test Case 1: Valid Data ===');
const result1 = validateData(validData, expectedSchema);
console.log('Detected Schema:', result1.detectedSchema);
console.log('Errors:', result1.errors.length ? result1.errors : 'None ✅');
console.log('Warnings:', result1.warnings.length ? result1.warnings : 'None ✅');

// Validate Case 2: Invalid email
console.log('\n=== Test Case 2: Invalid Email ===');
const result2 = validateData(invalidData, expectedSchema);
console.log('Detected Schema:', result2.detectedSchema);
console.log('Errors:', result2.errors.length ? result2.errors : 'None ✅');
console.log('Warnings:', result2.warnings.length ? result2.warnings : 'None ✅');

// Validate Case 3: Inconsistent types
console.log('\n=== Test Case 3: Inconsistent Types ===');
const result3 = validateData(inconsistentData, expectedSchema);
console.log('Detected Schema:', result3.detectedSchema);
console.log('Errors:', result3.errors.length ? result3.errors : 'None ✅');
console.log('Warnings:', result3.warnings.length ? result3.warnings : 'None ✅');

console.log('\n📊 Summary:');
console.log('  Test 1: All fields match expected types ✅');
console.log('  Test 2: Email field detected as string instead of email ❌');
console.log('  Test 3: Multiple type mismatches due to inconsistent data ❌');
console.log('\n💡 Tip: Use this validation before processing imported data!');
