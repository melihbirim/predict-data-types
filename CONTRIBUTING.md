# Contributing to Predict Data Types

Thank you for your interest in contributing to predict-data-types! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setting up the Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/predict-data-types.git
   cd predict-data-types
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests to ensure everything works:**
   ```bash
   npm test
   npm run lint
   ```

## 🧪 Development Workflow

### Test-Driven Development (TDD)

We follow **Test-Driven Development** practices. Before implementing any changes:

1. **Write tests first** for the new functionality or bug fix
2. **Run tests** to ensure they fail initially
3. **Implement** the minimal code to make tests pass
4. **Refactor** while keeping tests green
5. **Run full test suite** to ensure no regressions

### Code Quality Standards

- **ESLint**: All code must pass ESLint checks (`npm run lint`)
- **Testing**: All new code must have corresponding tests
- **JSDoc**: Public functions must have JSDoc documentation
- **YAGNI Principle**: Don't add features that aren't needed
- **DRY Principle**: Don't repeat yourself

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write tests first:**
   ```bash
   # Add tests to test/index.spec.js
   npm test # Should fail initially
   ```

3. **Implement your changes:**
   ```bash
   # Make changes to index.js or other files
   npm test # Should pass now
   npm run lint # Should pass
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   ```

## 📝 Commit Message Guidelines

We follow conventional commit messages:

- `feat:` new features
- `fix:` bug fixes  
- `docs:` documentation changes
- `style:` formatting, missing semi colons, etc
- `refactor:` code refactoring
- `test:` adding missing tests
- `chore:` maintenance tasks

Examples:
```
feat: add support for IPv4 address detection
fix: resolve UUID pattern variable name bug
docs: update README with better examples
test: add edge cases for date validation
```

## 🔧 Code Style

### ESLint Configuration

We use ESLint with the following key rules:
- 4-space indentation
- Single quotes for strings
- Semicolons required
- No console.log in production code
- Prefer const over let/var

### JSDoc Documentation

All public functions must have JSDoc comments:

```javascript
/**
 * Brief description of what the function does
 * @param {string} value - Description of the parameter
 * @returns {boolean} Description of what is returned
 * @throws {Error} Description of when errors are thrown
 * 
 * @example
 * // Usage example
 * functionName('example input');
 * // Returns: expected output
 */
function functionName(value) {
    // Implementation
}
```

## 🧪 Testing Guidelines

### Test Structure

Tests are organized by functionality:

```javascript
describe('Feature Name', () => {
    it('should handle specific case', () => {
        // Arrange
        const input = 'test data';
        
        // Act  
        const result = predictDataTypes(input);
        
        // Assert
        expect(result).to.deep.equal(expectedOutput);
    });
});
```

### Test Categories

1. **Happy Path**: Normal use cases
2. **Edge Cases**: Boundary conditions, empty inputs, etc.
3. **Error Cases**: Invalid inputs, error conditions
4. **Integration**: Multiple features working together

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --grep "UUID"  # Run specific tests
npm run lint               # Check code style
npm run lint:fix          # Auto-fix style issues
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Minimal code example
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens  
5. **Environment**: Node.js version, OS, etc.

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
```js
const predictDataTypes = require('predict-data-types');
const result = predictDataTypes('your input here');
console.log(result); // Shows unexpected output
```

## Expected Behavior
Should return: `{ 'expected': 'result' }`

## Actual Behavior  
Actually returns: `{ 'actual': 'result' }`

## Environment
- Node.js version: 18.x
- Package version: 1.1.0
- OS: macOS/Linux/Windows
```

## 💡 Feature Requests

Before submitting feature requests:

1. **Check existing issues** to avoid duplicates
2. **Consider YAGNI**: Is this feature truly needed?
3. **Provide use cases**: Why is this feature valuable?
4. **Consider implementation**: How might this work?

**Feature Request Template:**
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Additional Context
Any other relevant information
```

## 🔍 Code Review Process

1. **Automated Checks**: All PRs must pass tests and linting
2. **Manual Review**: Code will be reviewed for:
   - Correctness and functionality
   - Test coverage and quality
   - Documentation completeness
   - Code style and maintainability
   - Performance implications
3. **Feedback**: Address any review comments
4. **Approval**: At least one maintainer approval required

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Tests are written and passing (`npm test`)
- [ ] Code passes linting (`npm run lint`)
- [ ] JSDoc documentation is added for new public functions
- [ ] README is updated if needed
- [ ] Commit messages follow conventional format
- [ ] No console.log statements in production code
- [ ] Changes follow YAGNI and DRY principles

## 📊 Performance Considerations

- **Regex Efficiency**: Avoid ReDoS-vulnerable patterns
- **Memory Usage**: Be mindful of large string processing
- **Time Complexity**: Consider algorithmic efficiency
- **Dependencies**: Minimize new dependencies

## 🏷️ Release Process

Maintainers handle releases following semantic versioning:
- **PATCH**: Bug fixes
- **MINOR**: New features (backward compatible)
- **MAJOR**: Breaking changes

## ❓ Questions?

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check README.md first

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments

---

Thank you for contributing to predict-data-types! Your help makes this project better for everyone. 🚀
