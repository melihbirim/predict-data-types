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

    it('should handle empty string input', () => {
        const types = predictDataTypes('');
        expect(types).to.deep.equal({});
    });

    it('should handle whitespace-only input', () => {
        const types = predictDataTypes('   ');
        expect(types).to.deep.equal({});
    });

    it('should throw error for non-string input', () => {
        expect(() => predictDataTypes(null)).to.throw('Input must be a string');
        expect(() => predictDataTypes(123)).to.throw('Input must be a string');
        expect(() => predictDataTypes({})).to.throw('Input must be a string');
    });

    it('should detect improved boolean values', () => {
        const text = 'true, false, yes, no, on, off, 1, 0';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            'true': 'boolean',
            'false': 'boolean',
            'yes': 'boolean',
            'no': 'boolean',
            'on': 'boolean',
            'off': 'boolean',
            '1': 'boolean',
            '0': 'boolean'
        });
    });

    it('should detect UUID values', () => {
        const text = '123e4567-e89b-12d3-a456-426614174000, not-a-uuid';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            '123e4567-e89b-12d3-a456-426614174000': 'uuid',
            'not-a-uuid': 'string'
        });
    });

});
