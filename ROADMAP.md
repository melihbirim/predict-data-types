# 🗺️ Predict Data Types - Roadmap

This roadmap outlines planned features and improvements. Items are organized by priority and implementation complexity.

## 🎯 **Current Status (v1.6.0)**

✅ **Completed Features:**

**Core Capabilities:**
- Smart `infer()` function - handles strings, arrays, objects, and arrays of objects
- JSON schema generation from objects and arrays
- CSV support with optional headers
- Zero runtime dependencies
- TypeScript definitions with function overloads

**Data Type Detection (14 types):**
- Primitives: string, number, boolean
- Specialized: email, phone, url, uuid, date, ip, color, percentage, currency
- Structured: array, object

**Date & Time:**
- 45+ date format support
- Month names (Jan, Feb, etc.)
- Timezone offset handling
- ISO 8601 and variants

**Developer Experience:**
- 53 comprehensive test cases
- Full JSDoc documentation
- ESLint v9 configuration
- Performance optimizations (cached regex patterns)
- Robust input validation

## 🚀 **Roadmap**

### **Phase 1: Additional Data Type Detection** (v1.6.0)

**High Impact, Easy Implementation**

- [ ] **MAC Address Detection**

  ```javascript
  '00:1B:63:84:45:E6' -> 'mac'
  '00-1B-63-84-45-E6' -> 'mac'
  ```

- [ ] **Semantic Version (SemVer)**

  ```javascript
  '1.0.0' -> 'semver'
  '2.3.4-beta.1' -> 'semver'
  '1.0.0-alpha+001' -> 'semver'
  ```

- [ ] **Time (standalone)**

  ```javascript
  '14:30' -> 'time'
  '14:30:45' -> 'time'
  '2:30 PM' -> 'time'
  ```

- [x] **Geographic Coordinates**

  ```javascript
  '40.7128, -74.0060' -> 'coordinate'
  '51.5074, -0.1278' -> 'coordinate'
  ```

- [ ] **Duration/Time Intervals**
  ```javascript
  '2h 30m' -> 'duration'
  '1d' -> 'duration'
  '45min' -> 'duration'
  ```

### **Phase 2: Advanced Data Types** (v1.7.0)

**Medium Impact, Medium Implementation**

- [ ] **RGB/RGBA Colors**

  ```javascript
  'rgb(255, 0, 0)' -> 'color'
  'rgba(255, 0, 0, 0.5)' -> 'color'
  ```

- [ ] **Binary/Octal/Hex Numbers**

  ```javascript
  '0b1010' -> 'binary'
  '0o755' -> 'octal'
  '0xFF' -> 'hex'
  ```

- [ ] **Credit Card Numbers** (pattern only)

  ```javascript
  '4532-1234-5678-9010' -> 'creditcard'
  '4532123456789010' -> 'creditcard'
  ```

- [ ] **ISBN Detection**

  ```javascript
  '978-3-16-148410-0' -> 'isbn'
  '0-306-40615-2' -> 'isbn'
  ```

- [ ] **File Paths**

  ```javascript
  '/usr/local/bin' -> 'filepath'
  'C:\\Program Files\\' -> 'filepath'
  './src/index.js' -> 'filepath'
  ```

- [ ] **MIME Types**

  ```javascript
  'image/png' -> 'mime'
  'application/json' -> 'mime'
  ```

- [ ] **Social Media Handles**
  ```javascript
  '@username' -> 'mention'
  '#javascript' -> 'hashtag'
  ```

### **Phase 3: Configuration & Customization** (v1.7.0)

**Medium Impact, Medium Implementation**

- [ ] **Configuration Options**

  ```javascript
  const options = {
    strictMode: true, // More conservative type detection
    customPatterns: {
      // User-defined regex patterns
      product_id: /^PRD-\d{6}$/,
      order_code: /^ORD-[A-Z]{3}-\d{4}$/,
    },
    dateFormats: ["DD/MM/YYYY"], // Limit date formats
    confidence: true, // Return confidence scores
    locale: "en-US", // Region-specific detection
  };
  
  infer(data, options);
  ```

- [ ] **Confidence Scores**

  ```javascript
  infer("user@example.com", { confidence: true });
  // Returns: { type: 'email', confidence: 0.95, alternates: ['string'] }
  ```

- [ ] **Custom Pattern Support**
  - Business-specific type definitions
  - Regex pattern validation
  - Pattern priority management

### **Phase 4: Schema Output Formats** (v1.8.0)

**High Impact, Medium Implementation**

- [ ] **JSON Schema Generation**

  ```javascript
  infer([{ name: "Alice", age: "25" }], { format: "jsonSchema" });
  // Returns full JSON Schema object
  ```

- [ ] **SQL DDL Generation**

  ```javascript
  infer([{ name: "Alice", age: "25" }], { 
    format: "sql",
    tableName: "users"
  });
  // Returns: "CREATE TABLE users (name VARCHAR(255), age INTEGER);"
  ```

- [ ] **TypeScript Interface Generation**

  ```javascript
  infer([{ name: "Alice", age: "25" }], {
    format: "typescript",
    interfaceName: "User"
  });
  // Returns: "interface User { name: string; age: number; }"
  ```

- [ ] **Other Format Support**
  - MongoDB schema
  - Prisma schema
  - GraphQL schema
  - Zod validation schema

### **Phase 5: Performance & Scalability** (v1.9.0)

**Medium Impact, High Implementation**

- [ ] **Batch Processing API**

  ```javascript
  const { batch } = require("predict-data-types");
  
  batch([
    { id: "1", email: "user1@test.com" },
    { id: "2", email: "user2@test.com" }
  ], { parallel: true });
  ```

- [ ] **Streaming API for Large Files**

  ```javascript
  const { stream } = require("predict-data-types");
  
  stream(fs.createReadStream("large.csv"))
    .on("schema", (schema) => console.log(schema))
    .on("progress", (percent) => console.log(`${percent}%`));
  ```

- [ ] **Performance Optimizations**
  - Web Workers support for browser
  - Memory-efficient processing
  - Incremental schema building
  - Smart sampling for large datasets

### **Phase 6: Advanced Features** (v2.0.0)

**High Impact, High Implementation**

- [ ] **Locale-Specific Detection**
  - Region-specific date formats (EU vs US)
  - Localized phone validation
  - Currency format detection
  - Address format recognition

- [ ] **Security-Aware Detection**

  ```javascript
  infer('****-****-****-1234') // → 'creditcard_masked'
  infer('***-**-1234') // → 'ssn_masked'
  ```

- [ ] **Statistical Analysis**
  - Data quality metrics
  - Null/empty value percentages
  - Value distribution analysis
  - Outlier detection

- [ ] **Machine Learning Integration**
  - Pattern learning from user feedback
  - Context-aware type detection
  - Adaptive confidence scoring

## 🎯 **Target Use Cases**

### **Primary Users:**

1. **Data Scientists & Analysts** - CSV exploration, pipeline automation
2. **Backend Developers** - API validation, form processing
3. **ETL Pipeline Developers** - Data transformation and validation
4. **Frontend Developers** - File upload processing, data tables
5. **No-Code Tool Builders** - Automatic schema inference

### **Real-World Applications:**

- **Database Schema Generation** - Auto-create tables from CSV uploads
- **API Documentation** - Generate OpenAPI specs from sample data
- **Form Builder Tools** - Infer form field types from examples
- **Data Migration** - Type mapping between different systems
- **Analytics Dashboards** - Smart column type detection

## 🤔 **Considerations & Trade-offs**

### **What Might Be Removed:**

- [ ] **Review complex nested object/array parsing** - might be overkill for CSV use cases
- [ ] **Evaluate date format complexity** - too many formats can cause false positives
- [ ] **Assess phone validation scope** - very region-specific, consider simplification

### **Architecture Decisions:**

- **Performance vs Features** - Balance detection accuracy with speed
- **Bundle Size vs Functionality** - Consider tree-shaking and modular approach
- **Backward Compatibility** - Maintain API stability across versions

## 📅 **Timeline Estimates**

- **Phase 1 (v1.6.0)**: ~2-3 weeks - Additional simple data types
- **Phase 2 (v1.7.0)**: ~3-4 weeks - Advanced data types
- **Phase 3 (v1.8.0)**: ~3-4 weeks - Configuration & customization
- **Phase 4 (v1.9.0)**: ~4-5 weeks - Output format generation
- **Phase 5 (v2.0.0)**: ~6-8 weeks - Performance & scalability
- **Phase 6 (v2.1.0)**: ~10-12 weeks - Advanced features

## 🤝 **Contributing**

We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- How to propose new features (especially new data type detectors)
- Development setup and testing
- Code style and quality standards
- Pull request process

### **Suggested Data Types for Contributors**

Easy to implement (great for first-time contributors):

- MAC address detection
- Semantic versioning
- Time detection
- Hashtags and mentions
- MIME types

Medium difficulty:

- ~~Geographic coordinates~~ ✅ (implemented)
- File paths
- RGB/RGBA colors
- Binary/Octal/Hex numbers
- Credit card patterns

## 💬 **Feedback & Discussion**

Have ideas or suggestions? We'd love to hear from you:

- 🐛 [Issue Tracker](https://github.com/melihbirim/predict-data-types/issues) - Bug reports and feature requests
- 💭 [Discussions](https://github.com/melihbirim/predict-data-types/discussions) - Ideas and questions
- 📧 Direct feedback via issues or pull requests

---

**Last Updated:** December 14, 2025  
**Next Review:** January 14, 2026
