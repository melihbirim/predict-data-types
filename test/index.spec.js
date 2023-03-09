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
        const text = 'John,30, true,1991-05-12';
        const types = predictDataTypes(text);
        expect(types).to.deep.equal({
            'John': 'string',
            '30': 'number',
            'true': 'boolean',
            '1991-05-12': 'date'
        });
    });


})
