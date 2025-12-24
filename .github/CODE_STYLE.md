# Code Style Guide

## 🎨 Automatic Formatting

**Good news!** We use **husky** and **lint-staged** to automatically fix most formatting issues when you commit. You don't need to worry about manual formatting!

### How it works:

1. You write your code
2. You stage and commit your changes
3. **Pre-commit hook runs automatically**
4. ESLint fixes formatting issues
5. Fixed code is committed

### What gets auto-fixed:

✅ **Single quotes** - `"hello"` → `'hello'`  
✅ **Missing semicolons** - `const x = 1` → `const x = 1;`  
✅ **Trailing spaces** - Removed automatically  
✅ **Indentation** - Fixed to 4 spaces  
✅ **Object spacing** - `{foo:'bar'}` → `{ foo: 'bar' }`  

### What you need to fix manually:

❌ **Unused variables** - Remove or use them  
❌ **Undefined variables** - Import or declare them  
❌ **Invalid syntax** - Fix syntax errors  

---

## 📋 Our Style Standards

### ✅ DO Use:

```javascript
// Single quotes for strings
const name = 'predict-data-types';

// Semicolons at end of statements
const value = 42;

// 4-space indentation
function example() {
    if (true) {
        console.log('properly indented');
    }
}

// Spacing in objects and functions
const obj = { foo: 'bar', baz: 'qux' };
function myFunction() { }

// const for immutable values
const PI = 3.14;

// Descriptive variable names
const isValidEmail = true;
```

### ❌ DON'T Use:

```javascript
// Double quotes (will be auto-fixed)
const name = "predict-data-types";

// Missing semicolons (will be auto-fixed)
const value = 42

// 2-space or tab indentation (will be auto-fixed)
function example() {
  if (true) {
    console.log('wrong indentation');
  }
}

// No spacing (will be auto-fixed)
const obj = {foo:'bar',baz:'qux'};
function myFunction(){ }

// var keyword (will trigger error)
var oldStyle = true;

// Single-letter variables (except in loops)
const x = true; // What is x?
```

---

## 🔧 Manual Linting

If you want to check or fix linting before committing:

```bash
# Check for issues
npm run lint

# Auto-fix all fixable issues
npm run lint:fix
```

---

## 📝 Commit Messages

Use `style:` prefix for lint-related changes:

```bash
# Good commit messages
git commit -m "style: fix linting issues with quotes and spacing"
git commit -m "feat: add ISBN detector"
git commit -m "fix: resolve hashtag validation bug"
```

---

## 🚀 Quick Start

1. Write your code (don't worry about formatting)
2. Run tests: `npm test`
3. Commit: `git add . && git commit -m "feat: your feature"`
4. **Pre-commit hook auto-fixes formatting automatically!**
5. If commit fails, fix the errors shown and try again

That's it! The pre-commit hook handles the rest. 🎉
