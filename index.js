const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const os = require('os');

dayjs.extend(customParseFormat);

/**
 * Checks if a value represents a date in various formats
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid date
 */
function isDate(value) {
    const formats = [
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        'YYYY-MM-DDTHH:mm:ssZ', 
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DDTHH:mmZ',
        'YYYY-MM-DDTHH:mm',
        'YYYY-MM-DD HH:mm:ss.SSS',
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'DD/MM/YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm',
        'MM/DD/YYYY',
        'MM/DD/YYYY HH:mm:ss',
        'MM/DD/YYYY HH:mm',
        'DD-MMM-YYYY',
        'DD-MMM-YYYY HH:mm:ss',
        'DD-MMM-YYYY HH:mm',
        'MMM-DD-YYYY',
        'MMM-DD-YYYY HH:mm:ss',
        'MMM-DD-YYYY HH:mm',
    ];

    // Try built-in date parsing first
    const builtInDate = dayjs(value);
    if (builtInDate.isValid() && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return true;
    }

    // Try custom formats
    for (let i = 0; i < formats.length; i++) {
        const date = dayjs(value, formats[i], true);
        if (date.isValid()) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if a value represents a boolean
 * @param {any} val - The value to check
 * @returns {boolean} True if the value represents a boolean
 */
function isBoolean(val) {
    if (typeof val === 'boolean') {
        return true;
    }
    if (typeof val === 'string') {
        const lowerVal = val.toLowerCase().trim();
        return lowerVal === 'true' || lowerVal === 'false' || 
               lowerVal === 'yes' || lowerVal === 'no' ||
               lowerVal === 'on' || lowerVal === 'off' ||
               lowerVal === '1' || lowerVal === '0';
    }
    return val === 1 || val === 0;
}

/**
 * Checks if a value is a valid URL
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid URL
 */
function isURL(value) {
    const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
    return urlPattern.test(value);
}

/**
 * Checks if a value is a valid UUID
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid UUID
 */
function isUUID(value) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(value);
}

/**
 * Checks if a value is a valid phone number
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid phone number
 */
function isPhoneNumber(value) {
    const phonePattern = new RegExp(
        '^(\\+\\d{1,3}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$'
    );
    return phonePattern.test(value);
}

/**
 * Checks if a value is a valid email address
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid email
 */
function isEmail(value) {
    const emailPattern = new RegExp(
        '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
        'i'
    );
    return emailPattern.test(value);
}

/**
 * Tokenizes a comma-separated string, handling nested objects and arrays
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of tokens
 */
function tokenize(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
        const char = text.charAt(i);
        if (char == ' ') {
            i++;
            continue;
        };

        if (char === '{' || char === '[') {
            let j = i + 1;
            let count = 1;
            while (j < text.length && count > 0) {
                if (text.charAt(j) === '{' || text.charAt(j) === '[') {
                    count++;
                } else if (text.charAt(j) === '}' || text.charAt(j) === ']') {
                    count--;
                }
                j++;
            }
            tokens.push(text.substring(i, j));
            i = j;
        } else if (char === '"') {
            let j = i + 1;
            while (j < text.length && text.charAt(j) !== '"') {
                if (text.charAt(j) === '\\') {
                    j++;
                }
                j++;
            }
            tokens.push(text.substring(i, j + 1));
            i = j + 1;
        } else {
            let j = i + 1;
            while (j < text.length && text.charAt(j) !== ',' && text.charAt(j) !== '{' && text.charAt(j) !== '[') {
                j++;
            }
            tokens.push(text.substring(i, j));
            i = j;
        }
        if (i < text.length && text.charAt(i) === ',') {
            i++;
        }
    }
    return tokens;
}

/**
 * Predicts data types for comma-separated values
 * @param {string} str - The input string to analyze
 * @param {boolean} [firstRowIsHeader=false] - Whether the first row contains headers
 * @returns {Object} An object mapping field names/values to their predicted types
 * @throws {Error} When input is not a string
 */
function predictDataTypes(str, firstRowIsHeader = false) {
    // Input validation
    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }
    
    if (!str || str.trim() === '') {
        return {};
    }

    let header = '';
    let data = str;

    if (firstRowIsHeader) {
        let tmp = str.split(os.EOL);
        if (tmp.length > 1) {
            header = tmp[0].split(',');
            data = tokenize(tmp[1]);
        } else {
            return {};
        }
    } else {
        data = tokenize(str);
        header = data;
    }
    const types = {};

    for (let i = 0; i < data.length; i++) {
        const part = data[i].trim();
        const field = header[i] ? header[i].trim() : `field_${i}`;

        if (isBoolean(part)) {
            types[field] = 'boolean';
        } else if (!isNaN(parseFloat(part)) && isFinite(part)) {
            types[field] = 'number';
        } else if (isDate(part)) {
            types[field] = 'date';
        } else if (isURL(part)) {
            types[field] = 'url';
        } else if (isUUID(part)) {
            types[field] = 'uuid';
        } else if (isPhoneNumber(part)) {
            types[field] = 'phone';
        } else if (isEmail(part)) {
            types[field] = 'email';
        } else if (part.startsWith('[') && part.endsWith(']')) {
            types[field] = 'array';
        } else if (part.startsWith('{') && part.endsWith('}')) {
            types[field] = 'object';
        }
        else {
            types[field] = 'string';
        }
    }
    return types;

}

module.exports = predictDataTypes;

