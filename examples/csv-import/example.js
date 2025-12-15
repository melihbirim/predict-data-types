/**
 * CSV Import Example
 * 
 * This example shows how to:
 * 1. Parse CSV data
 * 2. Automatically detect field types
 * 3. Generate validation schema
 * 4. Transform string values to proper types
 */

const fs = require('fs');
const path = require('path');
const { infer, DataTypes, Formats } = require('../../index');

// Read CSV file
const csvPath = path.join(__dirname, 'sample.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV manually (or use csv-parser library)
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        rows.push(row);
    }

    return rows;
}

const employees = parseCSV(csvContent);

console.log('📊 Imported Data (as strings):');
console.log(employees[0]);
console.log();

// Detect field types
const schema = infer(employees);

console.log('🔍 Detected Schema:');
console.log(schema);
console.log();

// Generate JSON Schema for validation
const jsonSchema = infer(employees, Formats.JSONSCHEMA);

console.log('📋 JSON Schema (for validation):');
console.log(JSON.stringify(jsonSchema, null, 2));
console.log();

// Transform data based on detected types
function transformData(rows, schema) {
    return rows.map(row => {
        const transformed = {};
        
        for (const [field, type] of Object.entries(schema)) {
            const value = row[field];
            
            // Transform based on detected type
            if (type === DataTypes.NUMBER) {
                transformed[field] = parseFloat(value);
            } else if (type === DataTypes.BOOLEAN) {
                transformed[field] = value.toLowerCase() === 'true';
            } else if (type === DataTypes.DATE) {
                transformed[field] = new Date(value);
            } else if (type === DataTypes.CURRENCY) {
                // Remove currency symbol and parse
                transformed[field] = parseFloat(value.replace(/[$,]/g, ''));
            } else {
                transformed[field] = value;
            }
        }
        
        return transformed;
    });
}

const transformedEmployees = transformData(employees, schema);

console.log('✅ Transformed Data (with proper types):');
console.log(transformedEmployees[0]);
console.log();
console.log('Type checks:');
console.log('  age:', typeof transformedEmployees[0].age); // number
console.log('  salary:', typeof transformedEmployees[0].salary); // number
console.log('  hire_date:', transformedEmployees[0].hire_date instanceof Date); // true
console.log('  active:', typeof transformedEmployees[0].active); // boolean
