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
    | 'object';

/**
 * Result object mapping field names/values to their predicted data types
 */
declare type PredictionResult = Record<string, DataType>;

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

export = predictDataTypes;
