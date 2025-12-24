/**
 * Supported data type constants
 * Use these instead of string literals for type-safe comparisons
 * @constant
 */
const DataTypes = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    EMAIL: 'email',
    PHONE: 'phone',
    URL: 'url',
    UUID: 'uuid',
    DATE: 'date',
    ARRAY: 'array',
    OBJECT: 'object',
    IP: 'ip',
    MACADDRESS: 'macaddress',
    COLOR: 'color',
    PERCENTAGE: 'percentage',
    CURRENCY: 'currency',
    MENTION: 'mention',
    CRON: 'cron',
    HASHTAG: 'hashtag',
    SEMVER: 'semver',
    TIME: 'time'
};

/**
 * Output format constants for schema generation
 * @constant
 */
const Formats = {
    NONE: 'none',
    JSONSCHEMA: 'jsonschema'
};

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
    CURRENCY: /^[$€£¥₹][\d,]+(?:\.\d{1,2})?$|^[\d,]+(?:\.\d{1,2})?[$€£¥₹]$/,
    MENTION: /^@[A-Za-z0-9][A-Za-z0-9_-]*$/,
    MAC_ADDRESS: /^(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/,
    HASHTAG: /^#[A-Za-z][A-Za-z0-9_]*$/,
    SEMANTIC_VERSION: /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
};

/**
 * Type priority order for resolving conflicts when multiple types are detected
 * More specific types should come before more general ones
 * @constant
 */
const TYPE_PRIORITY = [
    'uuid', 'email', 'phone', 'url', 'ip', 'semver', 'macaddress', 'mention', 'color', 'hashtag',
    'currency', 'percentage', 'date', 'cron', 'boolean',
    'number', 'array', 'object', 'string'
];

/**
 * Map our data types to JSON Schema types
 * @constant
 */
const JSON_SCHEMA_TYPE_MAP = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'email': 'string',
    'phone': 'string',
    'url': 'string',
    'uuid': 'string',
    'date': 'string',
    'ip': 'string',
    'semver': 'string',
    'color': 'string',
    'percentage': 'string',
    'currency': 'string',
    'mention': 'string',
    'cron': 'string',
    'hashtag': 'string',
    'macaddress': 'string',
    'array': 'array',
    'object': 'object'
};

/**
 * Map our data types to JSON Schema formats
 * @constant
 */
const JSON_SCHEMA_FORMAT_MAP = {
    'email': 'email',
    'url': 'uri',
    'uuid': 'uuid',
    'date': 'date-time',
    'ip': 'ipv4'
};

/**
 * Map our data types to JSON Schema patterns
 * @constant
 */
const JSON_SCHEMA_PATTERN_MAP = {
    'phone': '^(\\+\\d{1,3}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
    'color': '^#(?:[0-9a-fA-F]{3}){1,2}$',
    'percentage': '^-?\\d+(?:\\.\\d+)?%$',
    'currency': '^[$€£¥₹][\\d,]+(?:\\.\\d{1,2})?$|^[\\d,]+(?:\\.\\d{1,2})?[$€£¥₹]$',
    'mention': '^@[A-Za-z0-9][A-Za-z0-9_-]*$',
    'hashtag': '^#[A-Za-z][A-Za-z0-9_]*$'
};

/**
 * Resolves the most specific type from an array of detected types
 * @param {string[]} types - Array of detected types
 * @returns {string} The most specific type based on TYPE_PRIORITY
 */
function resolveType(types) {
    const typeCounts = {};
    types.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    for (const priorityType of TYPE_PRIORITY) {
        if (typeCounts[priorityType] === types.length) {
            return priorityType;
        }
    }

    return 'string';
}

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
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec'
    ];
    const normalized = monthString.toLowerCase().substring(0, 3);
    const monthIndex = monthNames.indexOf(normalized);
    return monthIndex === -1 ? null : monthIndex;
}

/**
 * Parse timezone offset string to minutes
//  * @param {string} tzString - Timezone string (e.g., '+05:30', '-08:00', 'Z')
//  * @returns {number|null} Offset in minutes or null if invalid
//  */
function parseTimezone(tzString) {
    if (tzString === 'Z' || tzString === 'z') return 0;
    const match = tzString.match(/^([+-])(\d{2}):?(\d{2})?$/);
    if (!match) return null;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3] || '00', 10);
    return sign * (hours * 60 + minutes);
}

/**
 * Parse a date string with a specific format
 * @param {string} input - Date string to parse
 * @param {string} format - Format pattern
 * @returns {Date|null} Parsed Date object or null if invalid
 */
function parseWithFormat(input, format) {
    const parts = input
        .trim()
        .split(/[\s\/\-\:\.TZ]+/)
        .filter((p) => p);
    const formatParts = format
        .trim()
        .split(/[\s\/\-\:\.TZ]+/)
        .filter((p) => p);

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

    if (
        dateValues.year === undefined ||
        dateValues.month === undefined ||
        dateValues.day === undefined
    ) {
        return null;
    }

    // Create date object (UTC if timezone specified, local otherwise)
    const date =
    timezoneOffset !== null
        ? new Date(
            Date.UTC(
                dateValues.year,
                dateValues.month,
                dateValues.day,
                dateValues.hour || 0,
                dateValues.minute || 0,
                dateValues.second || 0,
                dateValues.millisecond || 0
            )
        )
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
    if (
        date.getFullYear() !== dateValues.year ||
    date.getMonth() !== dateValues.month ||
    date.getDate() !== dateValues.day
    ) {
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


// Time format patterns supported for parsing
const TIME_FORMATS = [
    // ISO – most specific
    'HH:mm:ss.SSSZ',
    'HH:mm:ssZ',

    // 24-hour with milliseconds + timezone
    'HH:mm:ss.SSS z',
    'HH:mm:ss z',

    // 12-hour with milliseconds
    'hh:mm:ss.SSS a',
    'hh:mm:ss.SSS A',

    // 24-hour with milliseconds
    'HH:mm:ss.SSS',

    // 12-hour with seconds
    'hh:mm:ss a',
    'hh:mm:ss A',

    // 24-hour with seconds
    'HH:mm:ss',

    // 12-hour without seconds
    'hh:mm a',
    'hh:mm A',

    // 24-hour without seconds (smallest)
    'HH:mm'
];

/**
 * Parse AM/PM indicator
 * @param {string} ampmString - 'AM', 'PM', 'am', 'pm', 'a', 'p'
 * @returns {string|null} 'AM' or 'PM' or null if invalid
 */
function parseAMPM(ampmString) {
    const normalized = ampmString.toUpperCase();
    if (normalized === 'AM' || normalized === 'A'|| normalized === 'A.M.') {
        return 'AM';
    }else if (normalized === 'PM' || normalized === 'P'|| normalized === 'P.M.') {
        return 'PM';
    }
    return null;
}

/**
 * Parse a time string with a specific format
 * @param {string} input - Time string to parse
 * @param {string} format - Format pattern
 * @returns {Object|null} {hours, minutes, seconds, milliseconds, timezoneOffset} or null
 */
function parseWithTimeFormat(input, format) {
    const parts = [];
    const inputTrimmed = input.trim();
    const segments = inputTrimmed.split(' ');  // Split by space

    if (segments.length === 1) {
        // No space → time only (e.g., "14:30:45" or "14:30:45.123")
        const timeComponents = segments[0].split(':');

        if (Array.isArray(timeComponents)) {
            timeComponents.forEach((component) => parts.push(component));
        } else {
            parts.push(timeComponents);
        }

    } else if (segments.length === 2) {
        // Has space → time + timezone/ampm (e.g., "14:30:45 +05:30" or "02:30 PM")
        const timeComponents = segments[0].trim().split(/[\s\:TZ]+/).filter(p => p);

        if (Array.isArray(timeComponents)) {
            timeComponents.forEach((component) => parts.push(component));
        } else {
            parts.push(timeComponents);
        }

        // Add the second segment (timezone or AM/PM)
        parts.push(segments[1]);
    }

    if(parts.length < 2 || parts.length > 5){
        return null;
    }

    const formatParts = format.trim().split(/[\s\:\.TZ]+/).filter(p => p);

    const timeValues = {};
    let timezoneOffset = null;
    let partIndex = 0;

    for (let i = 0; i < formatParts.length && partIndex < parts.length; i++) {
        const formatPart = formatParts[i];
        const part = parts[partIndex];

        if (formatPart === 'HH') {
            const hour = parseInt(part, 10);
            if (isNaN(hour) || hour < 0 || hour > 23) return null;
            timeValues.hour = hour;
            partIndex++;
        } else if (formatPart === 'hh') {
            const hour = parseInt(part, 10);
            if (isNaN(hour) || hour < 1 || hour > 12) return null;
            timeValues.hour = hour;
            partIndex++;
        } else if (formatPart === 'mm') {
            if (!/^[0-5][0-9]$/.test(part)) return null;
            const minute = parseInt(part, 10);
            if (isNaN(minute) || minute < 0 || minute >  59) return null;
            timeValues.minute = minute;
            partIndex++;
        } else if (formatPart === 'ss') {
            const second = parseInt(part, 10);
            if (isNaN(second) || second < 0 || second > 59) return null;
            timeValues.second = second;
            partIndex++;
        } else if (formatPart === 'SSS') {
            const ms = parseInt(part, 10);
            if (isNaN(ms) || ms < 0 || ms > 999) return null;
            timeValues.millisecond = ms;
            partIndex++;
        }else if (formatPart === 'a' || formatPart === 'A') {
            const ampm = parseAMPM(part);
            if(!ampm){
                return null;
            }
            timeValues.ampm=ampm;
            partIndex++;
        } else if (formatPart === 'z') {
            timezoneOffset = parseTimezone(part);
            if (timezoneOffset === null || timezoneOffset!=='z') return null;
            partIndex++;
        }
    }
    if (timeValues.hour === undefined || timeValues.minute === undefined) {
        return null;
    }
    const time = timezoneOffset !== null
        ? new Date(Date.UTC(
            1970, 0, 1,  // Fixed date (epoch)
            timeValues.hour || 0,
            timeValues.minute || 0,
            timeValues.second || 0,
            timeValues.millisecond || 0
        ))
        : new Date(
            1970, 0, 1,  // Fixed date
            timeValues.hour || 0,
            timeValues.minute || 0,
            timeValues.second || 0,
            timeValues.millisecond || 0
        );


    // Apply timezone offset if present
    if (timezoneOffset !== null) {
        const localTime = time.getTime();
        const localOffset = time.getTimezoneOffset() * 60000;
        const targetOffset = timezoneOffset * 60000;
        const targetTime = localTime - localOffset + targetOffset;
        time.setTime(targetTime);
    }

    // Convert 12-hour to 24-hour BEFORE creating Date
    if (timeValues.ampm) {
        let hour = timeValues.hour || 0;
        if (timeValues.ampm.toUpperCase() === 'AM') {
            if (hour === 12) {
                hour = 0;  // 12:30 AM → 00:30
            }
        } else if (timeValues.ampm.toUpperCase() === 'PM') {
            if (hour !== 12) {
                hour += 12;  // 02:30 PM → 14:30
            }
            // 12:30 PM stays 12
        }
    }
    // Validate time didn't roll over (e.g., 25:00 → next day)
    if (time.getHours() !== (timeValues.hour || 0) ||
    time.getMinutes() !== (timeValues.minute || 0) ||
    time.getSeconds() !== (timeValues.second || 0)) {
        return null;
    }
    return time;

}




/**
 * Try to parse a time string with all supported formats
 * @param {string} input - Time string to parse
 * @returns {Object|null} Parsed time components or null
 */
function tryParseTime(input) {
    for (const format of TIME_FORMATS) {
        const time = parseWithTimeFormat(input, format);

        if (time !== null) {
            if(format==='HH:mm'){
                if(!/^(\d{2}):(\d{2})$/.test(time)) return null;

            }

            return time;
        }

    }
    return null;
}

/**
 * Check if a given value represents a valid time format
 * @param {string} value - Time string to validate
 * @returns {boolean} True if valid time format
 */
function isTime(value) {
    const trimmedValue = value.trim();
    if (trimmedValue.length < 3) return null;
    return tryParseTime(trimmedValue) !== null;
}


/**
 * Checks if a given value represents a boolean (true/false, yes/no, on/off, 1/0)
 * @param {*} val - The value to check
 * @returns {boolean} True if the value is a boolean representation, false otherwise
 */
function isBoolean(val) {
    if (typeof val === 'string') {
        const lower = val.toLowerCase();
        return (
            lower === 'true' ||
            lower === 'false' ||
            lower === 'yes' ||
            lower === 'no' ||
            lower === 'on' ||
            lower === 'off'
        );
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
 * Checks if a given value is a social media mention (e.g., @username)
 * Allows letters, numbers, underscores, and hyphens after the @,
 * must start with a letter or number.
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a mention, false otherwise
 */
function isMention(value) {
    return PATTERNS.MENTION.test(value);
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
 * Checks if a given value is a valid MAC address
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid MAC address, false otherwise
 */
function isMACAddress(value) {
    return PATTERNS.MAC_ADDRESS.test(value);
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
function isHashtag(value, options = {}) {
    if (!value.startsWith('#')) return false;

    // If preferring hashtags over 3-char hex, check hashtag pattern first
    if (options.preferHashtagOver3CharHex && value.length === 4) {
        // Check if it matches hashtag pattern before checking hex
        if (PATTERNS.HASHTAG.test(value)) {
            return true;
        }
    }

    // Reject hex colors (valid ones)
    if (isHexColor(value)) return false;

    // Reject hex-like patterns (invalid hex but looks like hex format)
    // E.g., #GGGGGG (6 chars, all letters) or #GGG (3 chars, all letters)
    // These should be treated as invalid strings, not hashtags
    if ((value.length === 4 || value.length === 7)) {
        // Check if it's all hex-like characters (letters and numbers only)
        const withoutHash = value.slice(1);
        const isHexLike = /^[A-Fa-f0-9]+$/.test(withoutHash);
        if (isHexLike) {
            // It's already handled by isHexColor above, so this won't be reached
            // But if somehow a malformed hex gets here, reject it
            return false;
        }
        // If it has non-hex characters at hex length, could be malformed hex
        // Check if it looks like someone tried to write hex (all caps letters)
        if (/^[A-Z]+$/.test(withoutHash)) {
            return false; // Looks like failed hex attempt
        }
    }

    // Test against hashtag pattern
    return PATTERNS.HASHTAG.test(value);
}

/**
 * Checks if a given value is a valid cron expression
 * @param {string} value - The value to check
 * @returns {boolean} True if the value is a valid cron expression, false otherwise
 */
function isCron(value) {
    const trimmedValue = value.trim();
    const fields = trimmedValue.split(/\s+/);

    // Must have exactly 5 fields
    if (fields.length !== 5) {
        return false;
    }

    // Field ranges: minute(0-59), hour(0-23), day(1-31), month(1-12), weekday(0-7)
    const ranges = [
        { min: 0, max: 59 }, // minute
        { min: 0, max: 23 }, // hour
        { min: 1, max: 31 }, // day
        { min: 1, max: 12 }, // month
        { min: 0, max: 7 }  // weekday (0 and 7 are Sunday)
    ];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!isValidCronField(field, ranges[i])) {
            return false;
        }
    }

    return true;
}

/**
 * Validates a single cron field
 * @param {string} field - The field to validate
 * @param {Object} range - The valid range {min, max}
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCronField(field, range) {
    if (field === '*') {
        return true;
    }

    // Handle step values like */5 or 1-5/2
    const stepParts = field.split('/');
    if (stepParts.length > 2) {
        return false;
    }

    const baseField = stepParts[0];
    const step = stepParts[1];

    // Validate step if present
    if (step !== undefined) {
        const stepNum = parseInt(step, 10);
        if (isNaN(stepNum) || stepNum < 1) {
            return false;
        }
    }

    // Handle ranges and lists
    const parts = baseField.split(',');
    for (const part of parts) {
        if (!isValidCronPart(part, range)) {
            return false;
        }
    }

    return true;
}

/**
 * Validates a single part of a cron field (before comma split)
 * @param {string} part - The part to validate
 * @param {Object} range - The valid range {min, max}
 * @returns {boolean} True if valid, false otherwise
 */
function isValidCronPart(part, range) {
    if (part === '*') {
        return true;
    }

    // Handle ranges like 1-5
    const rangeParts = part.split('-');
    if (rangeParts.length === 1) {
        // Single number
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= range.min && num <= range.max;
    } else if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0], 10);
        const end = parseInt(rangeParts[1], 10);
        return !isNaN(start) && !isNaN(end) && start >= range.min && end <= range.max && start <= end;
    }

    return false;
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
            while (
                i < textLength &&
        text[i] !== ',' &&
        text[i] !== '{' &&
        text[i] !== '['
            ) {
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
 * @param {Object} [options={}] - Detection options
 * @param {boolean} [options.preferHashtagOver3CharHex=false] - Prefer hashtags over 3-char hex colors for ambiguous values like #dev, #bad
 * @returns {string} The detected data type
 */
function detectFieldType(value, options = {}) {
    const trimmedValue = value.trim();

    if (isBoolean(trimmedValue)) {
        return 'boolean';
    } else if (isPercentage(trimmedValue)) {
        return 'percentage';
    } else if (isCurrency(trimmedValue)) {
        return 'currency';
    } else if (
        !isNaN(parseFloat(trimmedValue)) &&
    isFinite(trimmedValue) &&
    !PATTERNS.LEADING_ZERO.test(trimmedValue)
    ) {
    // Numbers, but not those with leading zeros like '01'
        return 'number';
    } else if (isDate(trimmedValue)) {
        return 'date';
    } else if (isTime(trimmedValue)) {
        return 'time';
    } else if (isURL(trimmedValue)) {
        return 'url';
    } else if (isUUID(trimmedValue)) {
        return 'uuid';
    } else if (isIPAddress(trimmedValue)) {
        return 'ip';
    } else if(isSemver(trimmedValue)){
        return 'semver';
    } else if (isMACAddress(trimmedValue)) {
        return 'macaddress';
    } else if (isPhoneNumber(trimmedValue)) {
        return 'phone';
    } else if (isEmail(trimmedValue)) {
        return 'email';
    } else if (isMention(trimmedValue)) {
        return 'mention';
    } else if (options.preferHashtagOver3CharHex && trimmedValue.length === 4 && isHashtag(trimmedValue, options)) {
        // When preferring hashtags, check 3-char values as hashtags first
        return 'hashtag';
    } else if (isHexColor(trimmedValue)) {
        return 'color';
    } else if (isHashtag(trimmedValue, options)) {
        return 'hashtag';
    } else if (isCron(trimmedValue)) {
        return 'cron';
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
        const field = header[i] && header[i].trim ? header[i].trim() : `field_${i}`;
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

/**
 * Converts our schema format to JSON Schema
 * @param {Object} schema - Schema object with field names and types
 * @returns {Object} JSON Schema object
 * @private
 */
function toJSONSchema(schema) {
    const properties = {};
    const required = [];

    Object.keys(schema).forEach((fieldName) => {
        const dataType = schema[fieldName];
        const jsonSchemaType = JSON_SCHEMA_TYPE_MAP[dataType] || 'string';

        properties[fieldName] = { type: jsonSchemaType };

        // Add format if applicable
        if (JSON_SCHEMA_FORMAT_MAP[dataType]) {
            properties[fieldName].format = JSON_SCHEMA_FORMAT_MAP[dataType];
        }

        // Add pattern for special types without standard format
        if (JSON_SCHEMA_PATTERN_MAP[dataType]) {
            properties[fieldName].pattern = JSON_SCHEMA_PATTERN_MAP[dataType];
        }

        required.push(fieldName);
    });

    return {
        type: 'object',
        properties,
        required
    };
}

/**
 * Infers data type(s) from any input - strings, arrays, objects, or array of objects
 * @param {string|string[]|Object|Array<Object>} input - Value(s) to analyze
 * @param {string} [format=Formats.NONE] - Output format: Formats.NONE (default) or Formats.JSONSCHEMA
 * @param {Object} [options={}] - Detection options
 * @param {boolean} [options.preferHashtagOver3CharHex=false] - Prefer hashtags over 3-char hex colors for ambiguous values like #dev, #bad
 * @returns {string|Object} DataType for primitives, or schema object for objects
 * @example
 * infer("2024-01-01") // → 'date'
 * infer(["1", "2", "3"]) // → 'number'
 * infer({ name: "Alice", age: "25" }) // → { name: 'string', age: 'number' }
 * infer({ name: "Alice", age: "25" }, Formats.JSONSCHEMA) // → { type: 'object', properties: {...}, required: [...] }
 * infer([{ name: "Alice" }, { name: "Bob" }]) // → { name: 'string' }
 * infer("#dev") // → 'color' (default: 3-char hex takes priority)
 * infer("#dev", Formats.NONE, { preferHashtagOver3CharHex: true }) // → 'hashtag'
 */
function infer(input, format = Formats.NONE, options = {}) {
    if (input === null || input === undefined) {
        throw new Error('Input cannot be null or undefined');
    }

    // Handle single string value
    if (typeof input === 'string') {
        return detectFieldType(input, options);
    }

    // Handle array
    if (Array.isArray(input)) {
        if (input.length === 0) {
            return 'string';
        }

        // Check if array contains objects (schema inference)
        const firstItem = input[0];
        if (
            firstItem !== null &&
      typeof firstItem === 'object' &&
      !Array.isArray(firstItem)
        ) {
            // Array of objects - infer schema
            const schema = inferSchemaFromObjects(input, options);

            // Convert to JSON Schema if requested
            if (format === Formats.JSONSCHEMA) {
                return toJSONSchema(schema);
            }

            return schema;
        }

        // Array of primitive values - find common type
        const types = input.map(val => detectFieldType(String(val), options));
        return resolveType(types);
    }

    // Handle single object
    if (typeof input === 'object') {
        const schema = inferSchemaFromObjects([input]);

        // Convert to JSON Schema if requested
        if (format === Formats.JSONSCHEMA) {
            return toJSONSchema(schema);
        }

        return schema;
    }

    throw new Error('Input must be a string, array, or object');
}

/**
 * Helper function to infer schema from objects
 * @param {Array<Object>} rows - Array of objects to analyze
 * @param {Object} [options={}] - Detection options
 * @returns {Object} Schema with field names as keys and types as values
 */
function inferSchemaFromObjects(rows, options = {}) {
    if (!rows.every(row => row !== null && typeof row === 'object' && !Array.isArray(row))) {
        throw new Error('All items must be objects');
    }

    if (rows.length === 0) {
        return {};
    }

    // Collect all unique field names
    const fieldNames = new Set();
    rows.forEach((row) => {
        Object.keys(row).forEach((key) => fieldNames.add(key));
    });

    // Analyze each field across all rows
    const schema = {};
    fieldNames.forEach((fieldName) => {
        const values = rows
            .map((row) => row[fieldName])
            .filter((val) => val !== undefined && val !== null && val !== '');

        if (values.length === 0) {
            schema[fieldName] = 'string';
            return;
        }

        const stringValues = values.map(val => String(val));
        const types = stringValues.map(val => detectFieldType(val, options));
        schema[fieldName] = resolveType(types);
    });

    return schema;
}

/**
 * Helper function to check if the input is a valid semantic versioning string
 * @param {String} input - The value to check
 * @returns {Boolean} True if the input is a valid semantic versioning string
 */
function isSemver(value) {
    return PATTERNS.SEMANTIC_VERSION.test(value);
}

module.exports = predictDataTypes;
module.exports.infer = infer;
module.exports.DataTypes = DataTypes;
module.exports.Formats = Formats;
