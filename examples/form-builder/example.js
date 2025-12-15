/**
 * Form Builder Example
 * 
 * This example shows how to auto-generate form fields
 * based on detected data types from sample data.
 * 
 * Perfect for:
 * - Admin panels
 * - CMS systems
 * - Low-code platforms
 * - Dynamic form generators
 */

const { infer, DataTypes } = require('../../index');

// Sample user data (could come from API, database, etc.)
const sampleUser = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-123-4567',
    age: '28',
    website: 'https://alice.dev',
    birthdate: '1995-06-15',
    newsletter: 'true',
    bio: 'Software engineer passionate about open source',
    favoriteColor: '#3498db',
    salary: '$75000'
};

console.log('📝 Building form from sample data...\n');

// Detect field types
const fieldTypes = infer(sampleUser);

console.log('🔍 Detected Field Types:');
console.log(fieldTypes);
console.log();

// Map types to HTML input types
function getInputType(dataType) {
    const typeMap = {
        [DataTypes.EMAIL]: 'email',
        [DataTypes.PHONE]: 'tel',
        [DataTypes.URL]: 'url',
        [DataTypes.NUMBER]: 'number',
        [DataTypes.DATE]: 'date',
        [DataTypes.BOOLEAN]: 'checkbox',
        [DataTypes.COLOR]: 'color',
        [DataTypes.CURRENCY]: 'number',
        [DataTypes.STRING]: 'text'
    };
    
    return typeMap[dataType] || 'text';
}

// Generate form configuration
function generateFormConfig(data, types) {
    return Object.keys(data).map(fieldName => {
        const dataType = types[fieldName];
        const inputType = getInputType(dataType);
        
        const config = {
            name: fieldName,
            label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
            type: inputType,
            dataType: dataType,
            value: data[fieldName]
        };
        
        // Add validation based on type
        if (dataType === DataTypes.EMAIL) {
            config.validation = { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };
        } else if (dataType === DataTypes.PHONE) {
            config.validation = { pattern: /^\d{3}-\d{3}-\d{4}$/ };
        } else if (dataType === DataTypes.URL) {
            config.validation = { pattern: /^https?:\/\/.+/ };
        } else if (dataType === DataTypes.NUMBER) {
            config.validation = { min: 0 };
        }
        
        // Special handling for long text
        if (fieldName === 'bio' || data[fieldName].length > 100) {
            config.type = 'textarea';
        }
        
        return config;
    });
}

const formConfig = generateFormConfig(sampleUser, fieldTypes);

console.log('🎨 Generated Form Configuration:');
console.log(JSON.stringify(formConfig, null, 2));
console.log();

// Generate HTML form (simplified)
function generateHTML(config) {
    let html = '<form>\n';
    
    config.forEach(field => {
        html += `  <div class="form-group">\n`;
        html += `    <label for="${field.name}">${field.label}</label>\n`;
        
        if (field.type === 'textarea') {
            html += `    <textarea id="${field.name}" name="${field.name}">${field.value}</textarea>\n`;
        } else if (field.type === 'checkbox') {
            const checked = field.value === 'true' ? ' checked' : '';
            html += `    <input type="${field.type}" id="${field.name}" name="${field.name}"${checked}>\n`;
        } else {
            html += `    <input type="${field.type}" id="${field.name}" name="${field.name}" value="${field.value}">\n`;
        }
        
        html += `  </div>\n`;
    });
    
    html += '  <button type="submit">Submit</button>\n';
    html += '</form>';
    
    return html;
}

console.log('📄 Generated HTML Form:');
console.log(generateHTML(formConfig));
console.log();

console.log('✅ Benefits:');
console.log('  - Email field gets type="email" with validation');
console.log('  - Phone field gets type="tel" with pattern validation');
console.log('  - Date field gets type="date" with date picker');
console.log('  - Number field gets type="number" with min validation');
console.log('  - Boolean field becomes checkbox');
console.log('  - Color field gets color picker');
console.log('  - Long text automatically becomes textarea');
