// eslint.config.js - ESLint v9 flat configuration compatible with Node.js 16+
module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**", "*.config.js"],
  },
  {
    files: ["*.js", "test/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        // Node.js globals
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        global: "readonly",
        // Test globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        before: "readonly",
        after: "readonly",
      },
    },
    rules: {
      // Core ESLint recommended rules (manual selection for Node 16 compatibility)
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-obj-calls": "error",
      "no-regex-spaces": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      // Code style rules
      indent: ["error", 4],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-console": "off", // Allow console in this project
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",
      "comma-dangle": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-function-paren": ["error", "never"],
    },
  },
];
