// Cached compiled regex patterns for performance
const PATTERNS = {
    URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    PHONE: /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
    LEADING_ZERO: /^0\d/,
    IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    IPV6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,6}:$|^(?:[0-9a-fA-F]{1,4}:)(?::[0-9a-fA-F]{1,4}){1,6}$/,
    HEX_COLOR: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
    PERCENTAGE: /^-?\d+(?:\.\d+)?%$/,
    CURRENCY: /^[$€£¥₹][\d,]+(?:\.\d{1,2})?$|^[\d,]+(?:\.\d{1,2})?[$€£¥₹]$/
};

// Date format patterns supported for parsing (from re-date-parser + extensions)
const DATE_FORMATS = [
    // ISO 8601 and variants with timezone
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
    // With timezone offset
    'YYYY/MM/DD HH:mm:ss.SSS z',
    'YYYY-MM-DD HH:mm:ss.SSS z',
    'MM/DD/YYYY HH:mm:ss.SSS z',
    'DD/MM/YYYY HH:mm:ss.SSS z',
    'YYYY/MM/DD HH:mm:ss z',
    'YYYY-MM-DD HH:mm:ss z',
    'MM/DD/YYYY HH:mm:ss z',
    'DD/MM/YYYY HH:mm:ss z',
    // With milliseconds
    'YYYY/MM/DD HH:mm:ss.SSS',
    'YYYY-MM-DD HH:mm:ss.SSS',
    'MM/DD/YYYY HH:mm:ss.SSS',
    'DD/MM/YYYY HH:mm:ss.SSS',
    // With month names and milliseconds
    'dd MMM yyyy HH:mm:ss.SSS z',
    'MMM dd yyyy HH:mm:ss.SSS z',
    'dd MMM yyyy HH:mm:ss.SSS',
    'MMM dd yyyy HH:mm:ss.SSS',
    // Standard date-time formats
    'YYYY/MM/DD HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss',
    'MM/DD/YYYY HH:mm:ss',
    'DD/MM/YYYY HH:mm:ss',
    // With month names
    'dd MMM yyyy HH:mm:ss',
    'MMM dd yyyy HH:mm:ss',
    'dd-MMM-yyyy HH:mm:ss',
    'MMM-dd-yyyy HH:mm:ss',
    // Date with time (hours and minutes only)
    'YYYY/MM/DD HH:mm',
    'YYYY-MM-DD HH:mm',
    'MM/DD/YYYY HH:mm',
    'DD/MM/YYYY HH:mm',
    'dd MMM yyyy HH:mm',
    'MMM dd yyyy HH:mm',
    // Date only formats
    'YYYY/MM/DD',
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    // With month names (date only)
    'dd MMM yyyy',
    'MMM dd yyyy',
    'dd-MMM-yyyy',
    'MMM-dd-yyyy'
];

/**
 * Parse month name to month index
 * @param {string} monthString - Month name (e.g., 'Jan', 'January')
 * @returns {number|null} Month index (0-11) or null if invalid
 */
function parseMonth(monthString) {
    const monthNames = [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    const normalized = monthString.toLowerCase().substring(0, 3);
    const monthIndex = monthNames.indexOf(normalized);
    return monthIndex === -1 ? null : monthIndex;
}

/**
 * Parse timezone offset string to minutes
 * @param {string} tzString - Timezone string (e.g., '+05:30', '-08:00', 'Z')
 * @returns {number|null} Offset in minutes or null if invalid
 */
function parseTimezone(tzString) {
    if (tzString === 'Z' || tzString === 'z') return 0;
    const match = tzString.match(/^([+-])(\d{2}):?(\d{2})?$/);
    if (!match) return null;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3] || '00', 10);
    return sign * ((hours * 60) + minutes);
}

/**
 * Parse a date string with a specific format
 * @param {string} input - Date string to parse
 * @param {string} format - Format pattern
 * @returns {Date|null} Parsed Date object or null if invalid
 */
function parseWithFormat(input, format) {
    const parts = input.trim().split(/[\s\/\-\:\.TZ]+/).filter(p => p);
    const formatParts = format.trim().split(/[\s\/\-\:\.TZ]+/).filter(p => p);

    if (parts.length < 3) return null; // At minimum need year, month, day

    const dateValues = {};
    let timezoneOffset = null;
    let partIndex = 0;

    for (let i = 0; i < formatParts.length && partIndex < parts.length; i++) {
        const formatPart = formatParts[i];
        const part = parts[partIndex];

        if (formatPart === 'YYYY' || formatPart === 'yyyy') {
            const year = parseInt(part, 10);
            if (isNaN(year) || part.length !== 4) return null;
            dateValues.year = year;
            partIndex++;
        } else if (formatPart === 'MM') {
            const month = parseInt(part, 10);
            if (isNaN(month) || month < 1 || month > 12) return null;
            dateValues.month = month - 1;
            partIndex++;
        } else if (formatPart === 'MMM') {
            const month = parseMonth(part);
            if (month === null) return null;
            dateValues.month = month;
            partIndex++;
        } else if (formatPart === 'DD' || formatPart === 'dd') {
            const day = parseInt(part, 10);
            if (isNaN(day) || day < 1 || day > 31) return null;
            dateValues.day = day;
            partIndex++;
        } else if (formatPart === 'HH') {
            const hour = parseInt(part, 10);
            if (isNaN(hour) || hour < 0 || hour > 23) return null;
            dateValues.hour = hour;
            partIndex++;
        } else if (formatPart === 'mm') {
            const minute = parseInt(part, 10);
            if (isNaN(minute) || minute < 0 || minute > 59) return null;
            dateValues.minute = minute;
            partIndex++;
        } else if (formatPart === 'ss') {
            const second = parseInt(part, 10);
            if (isNaN(second) || second < 0 || second > 59) return null;
            dateValues.second = second;
            partIndex++;
        } else if (formatPart === 'SSS') {
            const ms = parseInt(part, 10);
            if (isNaN(ms)) return null;
            dateValues.millisecond = ms;
            partIndex++;
        } else if (formatPart === 'z') {
            // Timezone offset
            timezoneOffset = parseTimezone(part);
            if (timezoneOffset === null) return null;
            partIndex++;
        }
    }

    if (dateValues.year === undefined || dateValues.month === undefined || dateValues.day === undefined) {
        return null;
    }

    // Create date object (UTC if timezone specified, local otherwise)
    const date = timezoneOffset !== null
        ? new Date(Date.UTC(
            dateValues.year,
            dateValues.month,
            dateValues.day,
            dateValues.hour || 0,
            dateValues.minute || 0,
            dateValues.second || 0,
            dateValues.millisecond || 0
        ))
        : new Date(
            dateValues.year,
            dateValues.month,
            dateValues.day,
            dateValues.hour || 0,
            dateValues.minute || 0,
            dateValues.second || 0,
            dateValues.millisecond || 0
        );

    // Apply timezone offset if present
    if (timezoneOffset !== null) {
        const localTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000;
        const targetOffset = timezoneOffset * 60000;
        const targetTime = localTime - localOffset + targetOffset;
        date.setTime(targetTime);
    }

    // Check if date rolled over (invalid date like Feb 30 becomes Mar 2)
    if (date.getFullYear() !== dateValues.year ||
        date.getMonth() !== dateValues.month ||
        date.getDate() !== dateValues.day) {
        return null;
    }

    return date;
}

/**
 * Try to parse a date string with all supported formats
 * @param {string} input - Date string to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */
function tryParseDate(input) {
    for (const format of DATE_FORMATS) {
        const date = parseWithFormat(input, format);
        if (date !== null) {
            return date;
        }
    }
    return null;
}

/**
 * Checks if a given value represents a valid date in various formats
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid date, false otherwise
 */
function isDate(value) {
    const trimmedValue = value.trim();

    // Basic length check
    if (trimmedValue.length < 8) return false;

    // Try to parse with supported formats
    const parsedDate = tryParseDate(trimmedValue);
    return parsedDate !== null;
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
 * Checks if a given value is a valid IP address (IPv4 or IPv6)
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid IP address, false otherwise
 */
function isIPAddress(value) {
    return PATTERNS.IPV4.test(value) || PATTERNS.IPV6.test(value);
}

/**
 * Checks if a given value is a valid hex color code
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid hex color, false otherwise
 */
function isHexColor(value) {
    return PATTERNS.HEX_COLOR.test(value);
}

/**
 * Checks if a given value is a percentage
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a percentage, false otherwise
 */
function isPercentage(value) {
    return PATTERNS.PERCENTAGE.test(value);
}

/**
 * Checks if a given value is a currency amount
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a currency amount, false otherwise
 */
function isCurrency(value) {
    return PATTERNS.CURRENCY.test(value);
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
        // Handle different line endings: \r\n (Windows), \n (Unix), \r (old Mac)
        const lines = str.split(/\r?\n|\r/);
        if (lines.length > 1 && lines[0].trim() && lines[1].trim()) {
            header = lines[0].split(',');
            data = tokenize(lines[1]);
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
    } else if (isPercentage(trimmedValue)) {
        return 'percentage';
    } else if (isCurrency(trimmedValue)) {
        return 'currency';
    } else if (!isNaN(parseFloat(trimmedValue)) && isFinite(trimmedValue) && !PATTERNS.LEADING_ZERO.test(trimmedValue)) {
        // Numbers, but not those with leading zeros like '01'
        return 'number';
    } else if (isDate(trimmedValue)) {
        return 'date';
    } else if (isURL(trimmedValue)) {
        return 'url';
    } else if (isUUID(trimmedValue)) {
        return 'uuid';
    } else if (isIPAddress(trimmedValue)) {
        return 'ip';
    } else if (isPhoneNumber(trimmedValue)) {
        return 'phone';
    } else if (isEmail(trimmedValue)) {
        return 'email';
    } else if (isHexColor(trimmedValue)) {
        return 'color';
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

