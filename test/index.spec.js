const chai = require('chai');
const expect = chai.expect;
const predictDataTypes = require('../index');

describe('predictDataTypes', () => {

    it('should predict data types for string and url', () => {
        const text = 'John, http://asd.com';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            'John': 'string',
            'http://asd.com': 'url'
        });
    });

    it('should predict data types with numbers and date', () => {
        const text = 'John, http://asd.com, 24, 3.4, 2023-01-01';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            'John': 'string',
            'http://asd.com': 'url',
            '24': 'number',
            '3.4': 'number',
            '2023-01-01': 'date'
        });
    });

    it('should predict data types for strings with phone numbers', () => {
        const text = '555-555-5555, (555) 555-5555, +1 555-555-5555, invalid-phone-number';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            '555-555-5555': 'phone',
            '(555) 555-5555': 'phone',
            '+1 555-555-5555': 'phone',
            'invalid-phone-number': 'string'
        });
    });

    it('should predict data types for arrays', () => {
        const text = '[["apple"], "banana", "orange"], {"name": "John", "age": 30}';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            '[["apple"], "banana", "orange"]': 'array',
            '{"name": "John", "age": 30}': 'object'
        });
    });

    it('should predict data types for JSON objects', () => {
        const text = 'name, age, married, dob \n John,30, true, 1991-05-12';
        const types = predictDataTypes(text, true);
        expect(types).to.deep.equal({
            'name': 'string',
            'age': 'number',
            'married': 'boolean',
            'dob': 'date'
        });
    });

    // Edge cases and input validation tests
    describe('Input validation and edge cases', () => {
        it('should handle null input', () => {
            expect(() => predictDataTypes(null)).to.throw('Input must be a string');
        });

        it('should handle undefined input', () => {
            expect(() => predictDataTypes(undefined)).to.throw('Input must be a string');
        });

        it('should handle empty string input', () => {
            const result = predictDataTypes('');
            expect(result).to.deep.equal({});
        });

        it('should handle whitespace-only string input', () => {
            const result = predictDataTypes('   ');
            expect(result).to.deep.equal({});
        });

        it('should handle non-string input types', () => {
            expect(() => predictDataTypes(123)).to.throw('Input must be a string');
            expect(() => predictDataTypes({})).to.throw('Input must be a string');
            expect(() => predictDataTypes([])).to.throw('Input must be a string');
        });

        it('should handle single character input', () => {
            const result = predictDataTypes('a');
            expect(result).to.deep.equal({ 'a': 'string' });
        });

        it('should handle missing header fields gracefully', () => {
            const csvData = 'name,age,active\nJohn,30'; // Missing third column
            const result = predictDataTypes(csvData, true);
            expect(result).to.deep.equal({
                'name': 'string',
                'age': 'number'
            });
        });

        it('should handle more data fields than header fields', () => {
            const csvData = 'name,age\nJohn,30,true,extra'; // Extra columns
            const result = predictDataTypes(csvData, true);
            expect(result).to.deep.equal({
                'name': 'string',
                'age': 'number'
            });
        });
    });

    // UUID tests - testing the bug fix
    describe('UUID detection', () => {
        it('should correctly detect valid UUIDs', () => {
            const text = '550e8400-e29b-41d4-a716-446655440000';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '550e8400-e29b-41d4-a716-446655440000': 'uuid'
            });
        });

        it('should correctly detect multiple UUIDs', () => {
            const text = '550e8400-e29b-41d4-a716-446655440000, 6ba7b810-9dad-11d1-80b4-00c04fd430c8';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '550e8400-e29b-41d4-a716-446655440000': 'uuid',
                '6ba7b810-9dad-11d1-80b4-00c04fd430c8': 'uuid'
            });
        });

        it('should not detect invalid UUIDs', () => {
            const text = '550e8400-e29b-41d4-a716-44665544000, not-a-uuid-at-all';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '550e8400-e29b-41d4-a716-44665544000': 'string',
                'not-a-uuid-at-all': 'string'
            });
        });
    });

    // Enhanced boolean detection tests
    describe('Boolean detection', () => {
        it('should detect various true/false representations', () => {
            const text = 'true, false, TRUE, FALSE, yes, no, YES, NO, on, off, ON, OFF';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                'true': 'boolean',
                'false': 'boolean',
                'TRUE': 'boolean',
                'FALSE': 'boolean',
                'yes': 'boolean',
                'no': 'boolean',
                'YES': 'boolean',
                'NO': 'boolean',
                'on': 'boolean',
                'off': 'boolean',
                'ON': 'boolean',
                'OFF': 'boolean'
            });
        });

        it('should detect comprehensive boolean representations', () => {
            const text = 'true, false, yes, no, on, off';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                'true': 'boolean',
                'false': 'boolean',
                'yes': 'boolean',
                'no': 'boolean',
                'on': 'boolean',
                'off': 'boolean'
            });
        });

        it('should not detect partial boolean words', () => {
            const text = 'truthy, falsy, yesss, nope, online, offline, 10, 01';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                'truthy': 'string',
                'falsy': 'string',
                'yesss': 'string',
                'nope': 'string',
                'online': 'string',
                'offline': 'string',
                '10': 'number',
                '01': 'string' // Leading zero makes it a string
            });
        });
    });

    // Email detection tests
    describe('Email detection', () => {
        it('should detect valid email addresses', () => {
            const text = 'user@example.com, test.email+tag@domain.co.uk';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                'user@example.com': 'email',
                'test.email+tag@domain.co.uk': 'email'
            });
        });

        it('should not detect invalid email addresses', () => {
            const text = '@example.com, user@, user@domain, user.domain.com';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '@example.com': 'string',
                'user@': 'string',
                'user@domain': 'string',
                'user.domain.com': 'string'
            });
        });
    });

    // Date format tests
    describe('Date detection', () => {
        it('should detect various date formats', () => {
            const text = '2023-12-31, 31/12/2023, 12/31/2023, 2023-12-31T23:59:59Z';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '2023-12-31': 'date',
                '31/12/2023': 'date',
                '12/31/2023': 'date',
                '2023-12-31T23:59:59Z': 'date'
            });
        });

        it('should detect dates with month names', () => {
            const text = '15 Jan 2023, Jan 15 2023, 15-Feb-2024, Mar-01-2025';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '15 Jan 2023': 'date',
                'Jan 15 2023': 'date',
                '15-Feb-2024': 'date',
                'Mar-01-2025': 'date'
            });
        });

        it('should detect dates with time and month names', () => {
            const text = '15 Jan 2023 14:30:45, Jan 15 2023 09:15:00';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '15 Jan 2023 14:30:45': 'date',
                'Jan 15 2023 09:15:00': 'date'
            });
        });

        it('should not detect invalid dates', () => {
            const text = '2023-13-32, 32/13/2023, not-a-date';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '2023-13-32': 'string',
                '32/13/2023': 'string',
                'not-a-date': 'string'
            });
        });
    });

    // Number detection edge cases
    describe('Number detection', () => {
        it('should detect various number formats', () => {
            const text = '42, -42, 3.14, -3.14, 0, 0.0, 1e10, -1e-10';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '42': 'number',
                '-42': 'number',
                '3.14': 'number',
                '-3.14': 'number',
                '0': 'number',
                '0.0': 'number',
                '1e10': 'number',
                '-1e-10': 'number'
            });
        });

        it('should not detect invalid numbers', () => {
            const text = '42abc, 3.14.15, --42, 1e10e5';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '42abc': 'string',
                '3.14.15': 'string',
                '--42': 'string',
                '1e10e5': 'string'
            });
        });
    });

    // Tokenization edge cases
    describe('Tokenization edge cases', () => {
        it('should handle nested objects and arrays', () => {
            const text = '{"nested": {"array": [1, 2, 3]}}, [{"key": "value"}]';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '{"nested": {"array": [1, 2, 3]}}': 'object',
                '[{"key": "value"}]': 'array'
            });
        });

        it('should handle quoted strings with commas', () => {
            const text = '"Hello, world", "Another, string"';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '"Hello, world"': 'string',
                '"Another, string"': 'string'
            });
        });

        it('should handle strings with escaped quotes', () => {
            const text = '"He said \\"Hello\\"", normal-string';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '"He said \\"Hello\\""': 'string',
                'normal-string': 'string'
            });
        });
    });

    // Header mode tests
    describe('Header mode functionality', () => {
        it('should handle single line input in header mode', () => {
            const result = predictDataTypes('name, age', true);
            expect(result).to.deep.equal({});
        });

        it('should handle multi-line input with headers', () => {
            const text = 'name,age,active\nJohn,30,true';
            const types = predictDataTypes(text, true);
            expect(types).to.deep.equal({
                'name': 'string',
                'age': 'number',
                'active': 'boolean'
            });
        });

        it('should handle mismatched header and data columns', () => {
            const text = 'name,age,active\nJohn,30'; // Missing third column
            const types = predictDataTypes(text, true);
            expect(types).to.deep.equal({
                'name': 'string',
                'age': 'number'
            });
        });
    });

    describe('IP address detection', () => {
        it('should detect valid IPv4 addresses', () => {
            const text = '192.168.1.1, 8.8.8.8, 255.255.255.0';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '192.168.1.1': 'ip',
                '8.8.8.8': 'ip',
                '255.255.255.0': 'ip'
            });
        });

        it('should detect valid IPv6 addresses', () => {
            const text = '2001:0db8:85a3:0000:0000:8a2e:0370:7334, ::1';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '2001:0db8:85a3:0000:0000:8a2e:0370:7334': 'ip',
                '::1': 'ip'
            });
        });

        it('should not detect invalid IP addresses', () => {
            const text = '256.256.256.256, 192.168.1, not-an-ip';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '256.256.256.256': 'string',
                '192.168.1': 'string',
                'not-an-ip': 'string'
            });
        });
    });

    describe('Hex color detection', () => {
        it('should detect valid hex colors', () => {
            const text = '#FF0000, #00ff00, #ABC, #ffffff';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '#FF0000': 'color',
                '#00ff00': 'color',
                '#ABC': 'color',
                '#ffffff': 'color'
            });
        });

        it('should not detect invalid hex colors', () => {
            const text = '#GGGGGG, FF0000, #12345, #12';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '#GGGGGG': 'string',
                'FF0000': 'string',
                '#12345': 'string',
                '#12': 'string'
            });
        });
    });

    describe('Percentage detection', () => {
        it('should detect valid percentages', () => {
            const text = '50%, 100%, 0.5%, -25%';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '50%': 'percentage',
                '100%': 'percentage',
                '0.5%': 'percentage',
                '-25%': 'percentage'
            });
        });

        it('should not detect invalid percentages', () => {
            const text = '% 50, 50 %, percent';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '% 50': 'string',
                '50 %': 'string',
                'percent': 'string'
            });
        });
    });

    describe('Currency detection', () => {
        it('should detect valid currency amounts', () => {
            const text = '$100, €50.99, £25, ¥1000, ₹500.50';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '$100': 'currency',
                '€50.99': 'currency',
                '£25': 'currency',
                '¥1000': 'currency',
                '₹500.50': 'currency'
            });
        });

        it('should detect currency with symbol after amount', () => {
            const text = '100$, 50.99€';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '100$': 'currency',
                '50.99€': 'currency'
            });
        });

        it('should not detect invalid currency formats', () => {
            const text = '$ 100, 100 $, dollars';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '$ 100': 'string',
                '100 $': 'string',
                'dollars': 'string'
            });
        });
    });

});
