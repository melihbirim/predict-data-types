const chai = require('chai');
const expect = chai.expect;
const predictDataTypes = require('../index');
const { DataTypes, Formats } = predictDataTypes;

describe('DataTypes constants', () => {
    it('should export all type constants', () => {
        expect(DataTypes.STRING).to.equal('string');
        expect(DataTypes.NUMBER).to.equal('number');
        expect(DataTypes.BOOLEAN).to.equal('boolean');
        expect(DataTypes.EMAIL).to.equal('email');
        expect(DataTypes.PHONE).to.equal('phone');
        expect(DataTypes.URL).to.equal('url');
        expect(DataTypes.UUID).to.equal('uuid');
        expect(DataTypes.DATE).to.equal('date');
        expect(DataTypes.ARRAY).to.equal('array');
        expect(DataTypes.OBJECT).to.equal('object');
        expect(DataTypes.IP).to.equal('ip');
        expect(DataTypes.MACADDRESS).to.equal('macaddress');
        expect(DataTypes.COLOR).to.equal('color');
        expect(DataTypes.PERCENTAGE).to.equal('percentage');
        expect(DataTypes.CURRENCY).to.equal('currency');
        expect(DataTypes.MENTION).to.equal('mention');
        expect(DataTypes.CRON).to.equal('cron');
        expect(DataTypes.HASHTAG).to.equal('hashtag');
        expect(DataTypes.SEMVER).to.equal('semver');


    });
});

describe('Formats constants', () => {
    it('should export all format constants', () => {
        expect(Formats.NONE).to.equal('none');
        expect(Formats.JSONSCHEMA).to.equal('jsonschema');
    });
});

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
                '3.14.15': 'semver',
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
                '192.168.1': 'semver',
                'not-an-ip': 'string'
            });
        });
    });

    describe('MAC address detection', () => {
        it('should detect valid MAC addresses with colon separators', () => {
            const text = '00:1B:63:84:45:E6, FF:FF:FF:FF:FF:FF, 00:00:00:00:00:00';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '00:1B:63:84:45:E6': 'macaddress',
                'FF:FF:FF:FF:FF:FF': 'macaddress',
                '00:00:00:00:00:00': 'macaddress'
            });
        });

        it('should detect valid MAC addresses with hyphen separators', () => {
            const text = '00-1B-63-84-45-E6, FF-FF-FF-FF-FF-FF, 00-00-00-00-00-00';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '00-1B-63-84-45-E6': 'macaddress',
                'FF-FF-FF-FF-FF-FF': 'macaddress',
                '00-00-00-00-00-00': 'macaddress'
            });
        });

        it('should not detect invalid MAC addresses', () => {
            const text = '00:1B:63:84:45, 00:1B:63:84:45:E6:FF, not-a-mac, GG:HH:II:JJ:KK:LL';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '00:1B:63:84:45': 'string',
                '00:1B:63:84:45:E6:FF': 'string',
                'not-a-mac': 'string',
                'GG:HH:II:JJ:KK:LL': 'string'
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
            const text = '#GGGGGG, #ZZZ, #12345, #';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '#GGGGGG': 'string',
                '#ZZZ': 'string',
                '#12345': 'string',
                '#': 'string'
            });
        });
    });
    describe('RGB color detection', () => {
        const { infer } = predictDataTypes;

        it('should detect valid RGB and RGBA colors', () => {
            expect(infer('rgb(255, 0, 0)')).to.equal('color');
            expect(infer('rgba(0, 255, 0, 0.5)')).to.equal('color');
            expect(infer('rgb(128,128,128)')).to.equal('color');
            expect(infer('rgba(255,255,255,1)')).to.equal('color');
        });

        it('should handle variations in spacing', () => {
            expect(infer('rgb( 255 , 0 , 0 )')).to.equal('color');
            expect(infer('rgba( 0, 0, 0, 0 )')).to.equal('color');
        });

        it('should reject out-of-range or malformed RGB strings', () => {
            expect(infer('rgb(300, 0, 0)')).to.equal('string');
            expect(infer('rgba(255, 0, 0, 2)')).to.equal('string');
            expect(infer('rgb(255, 0)')).to.equal('string');
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
    describe('Hashtag detection', () => {
        it('should detect valid hashtags', () => {
            const text = '#hello, #HelloWorld, #test123, #HELLO';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '#hello': 'hashtag',
                '#HelloWorld': 'hashtag',
                '#test123': 'hashtag',
                '#HELLO': 'hashtag'
            });
        });

        it('should not detect invalid hashtags', () => {
            const text = '#, #!, #hello-world, hello#, ##double';
            const types = predictDataTypes(text);
            expect(types).to.deep.equal({
                '#': 'string',
                '#!': 'string',
                '#hello-world': 'string',
                'hello#': 'string',
                '##double': 'string'
            });
        });
    });


    describe('infer', () => {
        const { infer } = predictDataTypes;

        it('should infer type from single string value', () => {
            expect(infer('2024-01-01')).to.equal('date');
            expect(infer('test@example.com')).to.equal('email');
            expect(infer('42')).to.equal('number');
            expect(infer('true')).to.equal('boolean');
            expect(infer('https://example.com')).to.equal('url');
        });

        it('should detect social media mentions/usernames', () => {
            expect(infer('@username')).to.equal('mention');
            expect(infer('@user_name123')).to.equal('mention');
            expect(infer('@john-doe')).to.equal('mention');
        });

        it('should detect cron expressions', () => {
            expect(infer('0 0 * * *')).to.equal('cron');
            expect(infer('*/5 * * * *')).to.equal('cron');
            expect(infer('0 9-17 * * 1-5')).to.equal('cron');
            expect(infer('30 2 * * 0')).to.equal('cron');
            expect(infer('* * * *')).to.equal('string'); // Too few fields
            expect(infer('0 0 * * * *')).to.equal('string'); // Too many fields
            expect(infer('60 0 * * *')).to.equal('string'); // Invalid minute
            expect(infer('hello world')).to.equal('string'); // Not a cron
        });

        it('should infer type from array of values', () => {
            expect(infer(['1', '2', '3'])).to.equal('number');
            expect(infer(['true', 'false', 'yes'])).to.equal('boolean');
            expect(infer(['2024-01-01', '2024-01-02'])).to.equal('date');
        });

        it('should infer schema from single object', () => {
            const schema = infer({ name: 'Alice', age: '25', active: 'true' });
            expect(schema).to.deep.equal({
                name: 'string',
                age: 'number',
                active: 'boolean'
            });
        });

        it('should infer schema from array of objects', () => {
            const schema = infer([
                { name: 'Alice', age: '25', email: 'alice@example.com' },
                { name: 'Bob', age: '30', email: 'bob@example.com' }
            ]);
            expect(schema).to.deep.equal({
                name: 'string',
                age: 'number',
                email: 'email'
            });
        });

        it('should handle objects with different fields', () => {
            const data = [
                { name: 'Alice', email: 'alice@example.com' },
                { name: 'Bob', phone: '555-555-5555' },
                { age: '30', active: 'true' }
            ];
            const schema = infer(data);
            expect(schema).to.deep.equal({
                name: 'string',
                email: 'email',
                phone: 'phone',
                age: 'number',
                active: 'boolean'
            });
        });

        it('should handle various data types in objects', () => {
            const data = [
                {
                    url: 'https://example.com',
                    uuid: '550e8400-e29b-41d4-a716-446655440000',
                    ip: '192.168.1.1',
                    color: '#ff5733',
                    percentage: '85%',
                    currency: '$99.99'
                }
            ];
            const schema = infer(data);
            expect(schema).to.deep.equal({
                url: 'url',
                uuid: 'uuid',
                ip: 'ip',
                color: 'color',
                percentage: 'percentage',
                currency: 'currency'
            });
        });

        it('should handle null and undefined values in objects', () => {
            const data = [
                { name: 'Alice', age: null, email: undefined },
                { name: 'Bob', age: '30', email: 'bob@example.com' }
            ];
            const schema = infer(data);
            expect(schema).to.deep.equal({
                name: 'string',
                age: 'number',
                email: 'email'
            });
        });

        it('should handle empty array', () => {
            expect(infer([])).to.equal('string');
        });

        it('should convert non-string values to strings before type detection', () => {
            const data = [
                { count: 42, active: true, price: 99.99 }
            ];
            const schema = infer(data);
            expect(schema).to.deep.equal({
                count: 'number',
                active: 'boolean',
                price: 'number'
            });
        });

        it('should throw error for invalid input', () => {
            expect(() => infer(null)).to.throw('Input cannot be null or undefined');
            expect(() => infer(undefined)).to.throw('Input cannot be null or undefined');
        });

        it('should infer hashtag from single value', () => {
            expect(infer('#hello')).to.equal('hashtag');
        });

        it('should infer hashtag from array of values', () => {
            expect(infer(['#one', '#two', '#three'])).to.equal('hashtag');
        });

        it('should not infer hashtag when mixed with non-hashtag', () => {
            expect(infer(['#one', 'two'])).to.equal('string');
        });

        it('should prefer hex color over hashtag for 3-char ambiguous values by default', () => {
            expect(infer('#bad')).to.equal('color');
            expect(infer('#ace')).to.equal('color');
            expect(infer('#cab')).to.equal('color');
        });

        it('should prefer hashtag over 3-char hex when option is enabled', () => {
            expect(infer('#bad', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
            expect(infer('#ace', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
            expect(infer('#cab', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
            expect(infer('#fff', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
        });

        it('should keep non-ambiguous values unchanged with option', () => {
            // Non-hex letters stay hashtag
            expect(infer('#zzz', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
            // Numbers start stays color (doesn't match hashtag pattern)
            expect(infer('#123', 'none', { preferHashtagOver3CharHex: true })).to.equal('color');
            // 6-char hex stays color
            expect(infer('#abcdef', 'none', { preferHashtagOver3CharHex: true })).to.equal('color');
            // Long hashtag stays hashtag
            expect(infer('#developer', 'none', { preferHashtagOver3CharHex: true })).to.equal('hashtag');
        });

        it('should follow semver.org examples for valid and invalid versions', () => {
            // Valid semver examples (from semver.org examples)
            const valids = [
                '1.0.0',
                '2.0.0',
                '1.0.0-alpha',
                '1.0.0-alpha.1',
                '1.0.0-0.3.7',
                '1.0.0-x.7.z.92',
                '1.0.0+20130313144700',
                '1.0.0-beta+exp.sha.5114f85',
                '1.2.3-beta.1+exp.sha.5114f85',
                '0.0.0',
                '999999999999999999.1.0'
            ];

            valids.forEach(v => {
                expect(infer(v)).to.equal('semver');
                const res = predictDataTypes(v);
                if (Object.keys(res).length > 0) expect(res[v]).to.equal('semver');
            });

            // Invalid semver examples (from semver.org guidance)
            // Numbers that should be treated as numbers by the detector
            const numericCases = ['1', '1.0'];
            numericCases.forEach(v => {
                expect(infer(v)).to.equal('number');
                const res = predictDataTypes(v);
                if (Object.keys(res).length > 0) expect(res[v]).to.equal('number');
            });

            // Special-case: '1.0.0.0' is a valid IPv4 address and should be detected as 'ip'
            expect(infer('1.0.0.0')).to.equal('ip');
            const resIp = predictDataTypes('1.0.0.0');
            if (Object.keys(resIp).length > 0) expect(resIp['1.0.0.0']).to.equal('ip');

            const invalids = [
                'v1.0.0',
                '01.2.3', '1.02.3', '1.2.03', // leading zeros in core
                '1.0.0-', '1.0.0-alpha..1', '1.0.0-alpha.01', // malformed prerelease
                '1.0.0+!@#', '1.0.0+build+more'
            ];

            invalids.forEach(v => {
                expect(infer(v)).to.equal('string');
                const res = predictDataTypes(v);
                if (Object.keys(res).length > 0) expect(res[v]).to.equal('string');
            });

            // Arrays: all-semver -> semver; mixed -> string
            expect(infer(['1.0.0', '2.0.0'])).to.equal('semver');
            expect(infer(['1.0.0', '1.0'])).to.equal('string');
            expect(infer(['1.0.0', '5.6.7', '1.0'])).to.equal('string');
        });
    });

    describe('JSON Schema format', () => {
        const { infer } = predictDataTypes;

        it('should return JSON Schema for single object with jsonschema format', () => {
            const data = {
                name: 'Alice',
                age: '25',
                email: 'alice@example.com'
            };
            const result = infer(data, Formats.JSONSCHEMA);

            expect(result).to.have.property('type', 'object');
            expect(result).to.have.property('properties');
            expect(result).to.have.property('required');

            expect(result.properties.name).to.deep.equal({ type: 'string' });
            expect(result.properties.age).to.deep.equal({ type: 'number' });
            expect(result.properties.email).to.deep.equal({
                type: 'string',
                format: 'email'
            });

            expect(result.required).to.include.members(['name', 'age', 'email']);
        });

        it('should return JSON Schema for array of objects with jsonschema format', () => {
            const data = [
                { name: 'Alice', age: '25', active: 'true' },
                { name: 'Bob', age: '30', active: 'false' }
            ];
            const result = infer(data, Formats.JSONSCHEMA);

            expect(result).to.have.property('type', 'object');
            expect(result.properties.name).to.deep.equal({ type: 'string' });
            expect(result.properties.age).to.deep.equal({ type: 'number' });
            expect(result.properties.active).to.deep.equal({ type: 'boolean' });
            expect(result.required).to.include.members(['name', 'age', 'active']);
        });

        it('should include format for special types', () => {
            const data = {
                email: 'test@example.com',
                website: 'https://example.com',
                id: '550e8400-e29b-41d4-a716-446655440000',
                created: '2023-12-31',
                ip: '192.168.1.1'
            };
            const result = infer(data, Formats.JSONSCHEMA);

            expect(result.properties.email.format).to.equal('email');
            expect(result.properties.website.format).to.equal('uri');
            expect(result.properties.id.format).to.equal('uuid');
            expect(result.properties.created.format).to.equal('date-time');
            expect(result.properties.ip.format).to.equal('ipv4');
        });

        it('should include pattern for types without standard format', () => {
            const data = {
                phone: '555-555-5555',
                color: '#FF0000',
                percent: '50%',
                price: '$99.99'
            };
            const result = infer(data, Formats.JSONSCHEMA);

            expect(result.properties.phone).to.have.property('pattern');
            expect(result.properties.color).to.have.property('pattern');
            expect(result.properties.percent).to.have.property('pattern');
            expect(result.properties.price).to.have.property('pattern');
        });

        it('should return simple schema by default (no format parameter)', () => {
            const data = { name: 'Alice', age: '25' };
            const result = infer(data);

            // Should be simple schema, not JSON Schema
            expect(result).to.not.have.property('type');
            expect(result).to.not.have.property('properties');
            expect(result).to.deep.equal({ name: 'string', age: 'number' });
        });

        it('should return simple schema when format is Formats.NONE', () => {
            const data = { name: 'Alice', age: '25' };
            const result = infer(data, Formats.NONE);

            expect(result).to.deep.equal({ name: 'string', age: 'number' });
        });
        it('should include pattern for hashtag in JSON Schema', () => {
            const data = { tag: '#helloWorld' };
            const schema = infer(data, Formats.JSONSCHEMA);

            expect(schema.properties.tag.type).to.equal('string');
            expect(schema.properties.tag).to.have.property('pattern');
        });


    });

});
