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

});
