/**
 * API Response Analyzer Example
 * 
 * This example shows how to:
 * 1. Analyze API responses automatically
 * 2. Generate JSON Schema for validation
 * 3. Create TypeScript interfaces
 * 4. Document API structure
 */

const { infer, Formats } = require('../../index');

// Simulated API response (in real world, this would come from fetch/axios)
const apiResponse = [
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'alice_dev',
        email: 'alice@example.com',
        age: '28',
        isActive: 'true',
        website: 'https://alice.dev',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-12-14T08:45:00Z',
        ipAddress: '192.168.1.100',
        role: 'admin'
    },
    {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        username: 'bob_smith',
        email: 'bob@example.com',
        age: '35',
        isActive: 'false',
        website: 'https://bobsmith.io',
        createdAt: '2023-06-20T14:20:00Z',
        lastLogin: '2024-12-10T16:30:00Z',
        ipAddress: '10.0.0.50',
        role: 'user'
    }
];

console.log('🌐 Analyzing API Response...\n');

// Simple schema detection
const simpleSchema = infer(apiResponse);

console.log('📊 Detected Schema:');
console.log(simpleSchema);
console.log();

// JSON Schema for validation (use with Ajv, joi, etc.)
const jsonSchema = infer(apiResponse, Formats.JSONSCHEMA);

console.log('📋 JSON Schema (for validation libraries):');
console.log(JSON.stringify(jsonSchema, null, 2));
console.log();

// Generate TypeScript interface
function generateTypeScriptInterface(schema, interfaceName = 'ApiResponse') {
    const typeMap = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        email: 'string',
        phone: 'string',
        url: 'string',
        uuid: 'string',
        date: 'Date',
        ip: 'string',
        color: 'string',
        percentage: 'string',
        currency: 'string',
        array: 'any[]',
        object: 'object'
    };

    let interfaceCode = `interface ${interfaceName} {\n`;
    
    for (const [field, type] of Object.entries(schema)) {
        const tsType = typeMap[type] || 'string';
        interfaceCode += `  ${field}: ${tsType};\n`;
    }
    
    interfaceCode += '}';
    
    return interfaceCode;
}

console.log('📝 Generated TypeScript Interface:');
console.log(generateTypeScriptInterface(simpleSchema, 'User'));
console.log();

// Generate API documentation
function generateAPIDocs(schema) {
    console.log('📖 API Documentation:\n');
    console.log('## User Object\n');
    console.log('| Field       | Type       | Format      | Description |');
    console.log('|-------------|------------|-------------|-------------|');
    
    for (const [field, type] of Object.entries(schema)) {
        let description = '';
        
        if (type === 'uuid') description = 'Unique identifier';
        else if (type === 'email') description = 'User email address';
        else if (type === 'date') description = 'ISO 8601 timestamp';
        else if (type === 'boolean') description = 'True/false flag';
        else if (type === 'ip') description = 'IP address';
        
        console.log(`| ${field.padEnd(11)} | ${type.padEnd(10)} | ${type.padEnd(11)} | ${description} |`);
    }
}

generateAPIDocs(simpleSchema);
console.log();

// Validation example (pseudo-code with Ajv)
console.log('✅ Use with validation libraries:\n');
console.log('```javascript');
console.log("const Ajv = require('ajv');");
console.log('const ajv = new Ajv();');
console.log('');
console.log('const schema = infer(apiResponse, Formats.JSONSCHEMA);');
console.log('const validate = ajv.compile(schema);');
console.log('');
console.log('// Validate new data');
console.log('const valid = validate(newUserData);');
console.log('if (!valid) {');
console.log('  console.log(validate.errors);');
console.log('}');
console.log('```');
