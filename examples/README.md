# Examples

This directory contains practical examples showing how to use `predict-data-types` in real-world scenarios.

## Running Examples

```bash
# Navigate to any example directory and run:
cd examples/csv-import
node example.js
```

**Note:** Examples use `require('../../index')` for local testing. When using in your own projects, replace with:
```javascript
const { infer, DataTypes, Formats } = require('predict-data-types');
```

## Available Examples

### 📊 [CSV Import](./csv-import)
Shows how to:
- Parse CSV files
- Auto-detect column types
- Generate validation schemas
- Transform string data to proper types

**Use cases:** Data import tools, ETL pipelines, spreadsheet applications

---

### 🎨 [Form Builder](./form-builder)
Shows how to:
- Auto-generate form fields from data
- Map types to HTML input types
- Add validation based on detected types
- Create dynamic admin panels

**Use cases:** Admin panels, CMS systems, low-code platforms

---

### 🌐 [API Analyzer](./api-analyzer)
Shows how to:
- Analyze API responses
- Generate JSON Schema for validation
- Create TypeScript interfaces
- Auto-document API structure

**Use cases:** API documentation, code generation, validation setup

---

### ✅ [Data Validation](./data-validation)
Shows how to:
- Validate imported data against expected schema
- Detect data quality issues
- Identify type mismatches
- Find missing or extra fields

**Use cases:** Data quality checks, import validation, ETL verification

## Contributing Examples

Have a use case to share? PRs welcome! Please follow this structure:

```
examples/your-example/
├── example.js      # Runnable code with comments
├── README.md       # Optional: detailed explanation
└── sample-data.*   # Optional: sample data files
```
