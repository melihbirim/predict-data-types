// eslint.config.js - ESLint v9 flat configuration
const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        ignores: ['node_modules/**', 'coverage/**', '*.config.js']
    },
    {
        files: ['*.js', 'test/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                // Node.js globals
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                // Test globals
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                before: 'readonly',
                after: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-console': 'off', // Allow console in this project
            'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],
            'prefer-const': 'error',
            'no-var': 'error',
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'space-before-function-paren': ['error', 'never']
        }
    }
];
