// Type definitions for predict-data-types
// Project: predict-data-types
// Definitions by: Melih Birim

/**
 * Supported data types that can be predicted
 */
declare type DataType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'email'
    | 'phone'
    | 'url'
    | 'uuid'
    | 'date'
    | 'array'
    | 'object'
    | 'ip'
    | 'macaddress'
    | 'color'
    | 'percentage'
    | 'currency'
    | 'mention'
    | 'cron'
    | 'hashtag'
    | 'emoji'
    | 'filepath'
    | 'semver'
    | 'time'
    | 'isbn'
    | 'postcode';

/**
 * Data type constants for type-safe comparisons
 * @constant
 */
declare const DataTypes: {
    readonly STRING: 'string';
    readonly NUMBER: 'number';
    readonly BOOLEAN: 'boolean';
    readonly EMAIL: 'email';
    readonly PHONE: 'phone';
    readonly URL: 'url';
    readonly UUID: 'uuid';
    readonly DATE: 'date';
    readonly ARRAY: 'array';
    readonly OBJECT: 'object';
    readonly IP: 'ip';
    readonly MACADDRESS: 'macaddress';
    readonly COLOR: 'color';
    readonly PERCENTAGE: 'percentage';
    readonly CURRENCY: 'currency';
    readonly MENTION: 'mention';
    readonly CRON: 'cron';
    readonly HASHTAG: 'hashtag';
    readonly EMOJI: 'emoji';
    readonly FILEPATH: 'filepath';
    readonly SEMVER: 'semver'; // semver : semantic versioning
    readonly TIME: 'time';
    readonly ISBN: 'isbn';
    readonly POSTCODE: 'postcode';
};

/**
 * Output format constants for schema generation
 * @constant
 */
declare const Formats: {
    readonly NONE: 'none';
    readonly JSONSCHEMA: 'jsonschema';
};

/**
 * Result object mapping field names/values to their predicted data types
 */
declare type PredictionResult = Record<string, DataType>;

/**
 * JSON Schema object type
 */
declare type JSONSchema = {
    type: 'object';
    properties: Record<string, {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object';
        format?: 'email' | 'uri' | 'uuid' | 'date-time' | 'ipv4';
        pattern?: string;
    }>;
    required: string[];
};

/**
 * Predicts data types for comma-separated values or structured data
 * 
 * @param str - The input string to analyze
 * @param firstRowIsHeader - Whether to treat the first row as column headers (default: false)
 * @returns Object mapping field names/values to their predicted data types
 * @throws Error when input is null, undefined, or not a string
 * 
 * @example
 * ```typescript
 * const predictDataTypes = require('predict-data-types');
 * 
 * // Basic usage
 * const result = predictDataTypes('John, 30, true, 2023-01-01');
 * // Result: { 'John': 'string', '30': 'number', 'true': 'boolean', '2023-01-01': 'date' }
 * 
 * // With headers  
 * const csvResult = predictDataTypes('name,age,active\nJohn,30,true', true);
 * // Result: { 'name': 'string', 'age': 'number', 'active': 'boolean' }
 * ```
 */
declare function predictDataTypes(str: string, firstRowIsHeader?: boolean): PredictionResult;

declare namespace predictDataTypes {
    /**
     * Infers data type(s) from any input - strings, arrays, objects, or array of objects
     *
     * @param value - A single string value to analyze
     * @param format - Output format: Formats.NONE (default) or Formats.JSONSCHEMA
     * @returns The predicted data type
     *
     * @example
     * ```typescript
     * const { infer } = require('predict-data-types');
     *
     * infer("2024-01-01") // → 'date'
     * infer("11:59 PM") // → 'time'
     * infer("test@example.com") // → 'email'
     * infer("42") // → 'number'
     * ```
     */
    function infer(value: string, format?: 'none'): DataType;

    /**
     * Infers data type from array of values
     *
     * @param values - Array of values to analyze
     * @param format - Output format: Formats.NONE (default) or Formats.JSONSCHEMA
     * @returns The predicted data type common to all values
     *
     * @example
     * ```typescript
     * infer(["1", "2", "3"]) // → 'number'
     * infer(["true", "false"]) // → 'boolean'
     * ```
     */
    function infer(values: string[], format?: 'none'): DataType;

    /**
     * Infers schema from a single object
     *
     * @param data - Object to analyze
     * @param format - Output format: Formats.NONE for simple schema, Formats.JSONSCHEMA for JSON Schema format
     * @returns Schema with field names as keys and inferred types as values
     *
     * @example
     * ```typescript
     * const { infer, Formats } = require('predict-data-types');
     * 
     * infer({ name: "Alice", age: "25" })
     * // Returns: { name: 'string', age: 'number' }
     * 
     * infer({ name: "Alice", age: "25" }, Formats.JSONSCHEMA)
     * // Returns: { type: 'object', properties: { name: { type: 'string' }, ... }, required: [...] }
     * ```
     */
    function infer(data: Record<string, any>, format?: 'none'): PredictionResult;
    function infer(data: Record<string, any>, format: 'jsonschema'): JSONSchema;

    /**
     * Infers schema from array of objects
     *
     * @param data - Array of objects to analyze
     * @param format - Output format: Formats.NONE for simple schema, Formats.JSONSCHEMA for JSON Schema format
     * @returns Schema with field names as keys and inferred types as values
     *
     * @example
     * ```typescript
     * const { infer, Formats } = require('predict-data-types');
     * 
     * infer([
     *   { name: "Alice", age: "25", email: "alice@example.com" },
     *   { name: "Bob", age: "30", email: "bob@example.com" }
     * ])
     * // Returns: { name: 'string', age: 'number', email: 'email' }
     * 
     * infer([...], Formats.JSONSCHEMA)
     * // Returns: { type: 'object', properties: {...}, required: [...] }
     * ```
     */
    function infer(data: Array<Record<string, any>>, format?: 'none'): PredictionResult;
    function infer(data: Array<Record<string, any>>, format: 'jsonschema'): JSONSchema;

    /**
     * Data type constants for type-safe comparisons
     */
    export { DataTypes };

    /**
     * Output format constants for schema generation
     */
    export { Formats };
}

export = predictDataTypes;