import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
        global: 'readonly',
        describe: 'readonly',
        it: 'readonly'
      }
    },
    rules: {
      'indent': ['error', 4],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-console': 'off',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    }
  }
];