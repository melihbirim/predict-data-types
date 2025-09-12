const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const os = require('os');

// Enable dayjs plugins
dayjs.extend(customParseFormat);

// Cached compiled regex patterns for performance
const PATTERNS = {
    URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    PHONE: /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
    DATE_COMPONENT: /(\d{4})-(\d{1,2})-(\d{1,2})/,
    DATE_CHARS: /^[\d\-/\s:.TZ+-]+$/,
    LEADING_ZERO: /^0\d/
};

/**
 * Checks if a given value represents a valid date in various formats
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid date, false otherwise
 */
function isDate(value) {
    const formats = [
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
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
        'MMM-DD-YYYY HH:mm'
    ];

    // First try strict parsing with specific formats
    for (let i = 0; i < formats.length; i++) {
        const date = dayjs(value, formats[i], true);
        if (date.isValid() && date.format(formats[i]) === value) {
            return true;
        }
    }

    // For ISO format and basic dates, be more conservative
    // Only accept if it looks like a valid date and doesn't contain invalid characters
    if (!PATTERNS.DATE_CHARS.test(value)) {
        return false;
    }

    const defaultParsed = dayjs(value);
    if (defaultParsed.isValid() && value.length >= 8) { // At least YYYY-MM-DD length
        // Check if the parsed date's string representation matches the input
        // This prevents dayjs from "fixing" invalid dates like 2023-13-32
        const reformatted = defaultParsed.format('YYYY-MM-DD');
        if (value.startsWith(reformatted) || value === reformatted) {
            const year = defaultParsed.year();
            const month = defaultParsed.month() + 1;
            const day = defaultParsed.date();

            // Extract original components for validation
            const dateMatch = value.match(PATTERNS.DATE_COMPONENT);
            if (dateMatch) {
                const [, origYear, origMonth, origDay] = dateMatch;
                if (parseInt(origYear) === year &&
                    parseInt(origMonth) === month &&
                    parseInt(origDay) === day) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Checks if a given value represents a boolean (true/false, yes/no, on/off, 1/0)
 * @param {*} val - The value to check
 * @returns {boolean} True if the value is a boolean representation, false otherwise
 */
function isBoolean(val) {
    if (typeof val === 'string') {
        const lower = val.toLowerCase();
        return lower === 'true' || lower === 'false' ||
               lower === 'yes' || lower === 'no' ||
               lower === 'on' || lower === 'off';
    }
    return val === 1 || val === 0;
}

/**
 * Checks if a given value is a valid URL
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid URL, false otherwise
 */
function isURL(value) {
    return PATTERNS.URL.test(value);
}

/**
 * Checks if a given value is a valid UUID (Version 1-5)
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid UUID, false otherwise
 */
function isUUID(value) {
    return PATTERNS.UUID.test(value);
}


/**
 * Checks if a given value is a valid phone number
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid phone number, false otherwise
 */
function isPhoneNumber(value) {
    return PATTERNS.PHONE.test(value);
}

/**
 * Checks if a given value is a valid email address
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid email address, false otherwise
 */
function isEmail(value) {
    return PATTERNS.EMAIL.test(value);
}

/**
 * Tokenizes a string by splitting on commas while respecting quoted strings and nested objects/arrays
 * Optimized version with improved performance for large inputs
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of tokens
 */
function tokenize(text) {
    const tokens = [];
    const textLength = text.length;
    let i = 0;

    while (i < textLength) {
        // Skip whitespace at the beginning
        while (i < textLength && text[i] === ' ') {
            i++;
        }

        if (i >= textLength) break;

        const char = text[i];
        const tokenStart = i;

        if (char === '{' || char === '[') {
            // Handle nested objects/arrays
            const openChar = char;
            const closeChar = char === '{' ? '}' : ']';
            let depth = 1;
            i++;

            while (i < textLength && depth > 0) {
                if (text[i] === openChar) {
                    depth++;
                } else if (text[i] === closeChar) {
                    depth--;
                }
                i++;
            }
            tokens.push(text.substring(tokenStart, i));
        } else if (char === '"') {
            // Handle quoted strings
            i++;
            while (i < textLength && text[i] !== '"') {
                if (text[i] === '\\') {
                    i++; // Skip escaped character
                }
                i++;
            }
            i++; // Include closing quote
            tokens.push(text.substring(tokenStart, i));
        } else {
            // Handle regular tokens
            while (i < textLength && text[i] !== ',' && text[i] !== '{' && text[i] !== '[') {
                i++;
            }
            tokens.push(text.substring(tokenStart, i));
        }

        // Skip comma separator
        if (i < textLength && text[i] === ',') {
            i++;
        }
    }

    return tokens;
}

/**
 * Parses input string into header and data components
 * @param {string} str - The input string
 * @param {boolean} firstRowIsHeader - Whether first row should be treated as headers
 * @returns {{header: string[], data: string[]}} Parsed header and data
 */
function parseHeaderAndData(str, firstRowIsHeader) {
    let header = '';
    let data = str;

    if (firstRowIsHeader) {
        const tmp = str.split(os.EOL);
        if (tmp.length > 1) {
            header = tmp[0].split(',');
            data = tokenize(tmp[1]);
        } else {
            return { header: [], data: [] };
        }
    } else {
        data = tokenize(str);
        header = data;
    }

    return { header, data };
}

/**
 * Detects the data type for a single field value
 * @param {string} value - The value to analyze
 * @returns {string} The detected data type
 */
function detectFieldType(value) {
    const trimmedValue = value.trim();

    if (isBoolean(trimmedValue)) {
        return 'boolean';
    } else if (!isNaN(parseFloat(trimmedValue)) && isFinite(trimmedValue) && !PATTERNS.LEADING_ZERO.test(trimmedValue)) {
        // Numbers, but not those with leading zeros like '01'
        return 'number';
    } else if (isDate(trimmedValue)) {
        return 'date';
    } else if (isURL(trimmedValue)) {
        return 'url';
    } else if (isUUID(trimmedValue)) {
        return 'uuid';
    } else if (isPhoneNumber(trimmedValue)) {
        return 'phone';
    } else if (isEmail(trimmedValue)) {
        return 'email';
    } else if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
        return 'array';
    } else if (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) {
        return 'object';
    } else {
        return 'string';
    }
}

/**
 * Processes data fields and assigns types
 * @param {string[]} data - Array of data values
 * @param {string[]} header - Array of header names
 * @param {boolean} firstRowIsHeader - Whether headers are being used
 * @returns {Object<string, string>} Object mapping field names to types
 */
function processFields(data, header, firstRowIsHeader) {
    const types = {};

    for (let i = 0; i < data.length; i++) {
        // When using headers, only process fields that have corresponding headers
        if (firstRowIsHeader && i >= header.length) {
            continue; // Skip extra data fields beyond header length
        }

        // Handle missing header fields gracefully
        const field = (header[i] && header[i].trim) ? header[i].trim() : `field_${i}`;
        const fieldType = detectFieldType(data[i]);
        types[field] = fieldType;
    }

    return types;
}

/**
 * Predicts data types for comma-separated values or structured data
 * @param {string} str - The input string to analyze
 * @param {boolean} [firstRowIsHeader=false] - Whether to treat the first row as column headers
 * @returns {Object<string, string>} Object mapping field names/values to their predicted data types
 * @throws {Error} When input is null, undefined, or not a string
 *
 * @example
 * // Basic usage
 * predictDataTypes('John, 30, true, 2023-01-01')
 * // Returns: { 'John': 'string', '30': 'number', 'true': 'boolean', '2023-01-01': 'date' }
 *
 * @example
 * // With headers
 * predictDataTypes('name,age,active\nJohn,30,true', true)
 * // Returns: { 'name': 'string', 'age': 'number', 'active': 'boolean' }
 */
function predictDataTypes(str, firstRowIsHeader = false) {
    // Input validation
    if (str === null || str === undefined) {
        throw new Error('Input must be a string');
    }

    if (typeof str !== 'string') {
        throw new Error('Input must be a string');
    }

    // Handle empty string case or whitespace-only strings
    if (str.length === 0 || str.trim().length === 0) {
        return {};
    }

    // Parse input into header and data components
    const { header, data } = parseHeaderAndData(str, firstRowIsHeader);

    // Handle case where no valid data was parsed
    if (data.length === 0) {
        return {};
    }

    // Process fields and detect their types
    const types = processFields(data, header, firstRowIsHeader);

    // If no data was processed but we have non-empty input, treat as single empty string
    if (Object.keys(types).length === 0 && str.length > 0) {
        types[''] = 'string';
    }

    return types;
}

module.exports = predictDataTypes;

