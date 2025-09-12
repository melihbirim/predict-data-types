# 🗺️ Predict Data Types - Roadmap

This roadmap outlines the planned features and improvements for the predict-data-types package. Items are organized by priority and implementation complexity.

## 🎯 **Current Status (v1.1.0)**

✅ **Completed Features:**
- Automatic type detection for 10+ data types
- CSV support with optional headers
- Robust input validation and error handling
- TypeScript definitions
- Comprehensive test coverage (31+ tests)
- Performance optimizations (cached regex patterns)
- ESLint configuration and code quality
- JSDoc documentation

## 🚀 **Roadmap**

### **Phase 1: Enhanced Type Detection** (v1.2.0)

**High Impact, Easy Implementation**

- [ ] **Geographic Coordinates**
  ```javascript
  '40.7128,-74.0060' -> 'coordinates'
  'lat:40.7128,lng:-74.0060' -> 'coordinates'
  ```

- [ ] **IP Address Detection**
  ```javascript
  '192.168.1.1' -> 'ipv4'
  '2001:db8::1' -> 'ipv6'
  ```

- [ ] **Color Code Detection**
  ```javascript
  '#FF5733' -> 'color_hex'
  'rgb(255, 87, 51)' -> 'color_rgb'
  'rgba(255, 87, 51, 0.8)' -> 'color_rgba'
  'hsl(120, 100%, 50%)' -> 'color_hsl'
  ```

- [ ] **File & MIME Type Detection**
  ```javascript
  'document.pdf' -> 'file'
  'image/jpeg' -> 'mime_type'
  'application/json' -> 'mime_type'
  ```

### **Phase 2: Configuration & Customization** (v1.3.0)

**Medium Impact, Medium Implementation**

- [ ] **Configuration Options**
  ```javascript
  const options = {
    strictMode: true,           // More conservative type detection
    customPatterns: {           // User-defined regex patterns
      'product_id': /^PRD-\d{6}$/,
      'order_code': /^ORD-[A-Z]{3}-\d{4}$/
    },
    dateFormats: ['DD/MM/YYYY'], // Limit date formats
    confidence: true,            // Return confidence scores
    locale: 'en-US'             // Region-specific detection
  }
  ```

- [ ] **Confidence Scores**
  ```javascript
  // Returns: { value: 'email', confidence: 0.95, alternates: ['string'] }
  ```

- [ ] **Custom Pattern Support**
  - Business-specific type definitions
  - Regex pattern validation
  - Pattern priority management

### **Phase 3: Output Format Extensions** (v1.4.0)

**High Impact, Medium Implementation**

- [ ] **JSON Schema Generation**
  ```javascript
  predictDataTypes('John,25', { outputFormat: 'jsonSchema' });
  // Returns: { type: 'object', properties: { John: { type: 'string' } } }
  ```

- [ ] **SQL DDL Generation**
  ```javascript
  predictDataTypes('name,age\nJohn,25', { 
    header: true, 
    outputFormat: 'sql',
    tableName: 'users' 
  });
  // Returns: "CREATE TABLE users (name VARCHAR(255), age INTEGER);"
  ```

- [ ] **TypeScript Interface Generation**
  ```javascript
  predictDataTypes('name,age\nJohn,25', { 
    header: true, 
    outputFormat: 'typescript',
    interfaceName: 'User'
  });
  // Returns: "interface User { name: string; age: number; }"
  ```

- [ ] **Other Format Support**
  - MongoDB schema
  - Prisma schema
  - GraphQL schema
  - Zod validation schema

### **Phase 4: Performance & Scalability** (v1.5.0)

**Medium Impact, High Implementation**

- [ ] **Batch Processing API**
  ```javascript
  predictDataTypes.batch([
    'user1,25,email1@test.com',
    'user2,30,email2@test.com'
  ], { header: true, parallel: true });
  ```

- [ ] **Streaming API for Large Files**
  ```javascript
  predictDataTypes.stream(fs.createReadStream('large.csv'))
    .on('schema', (schema) => console.log(schema))
    .on('progress', (percent) => console.log(`${percent}% complete`));
  ```

- [ ] **Performance Optimizations**
  - Web Workers support for browser usage
  - Memory-efficient processing for large datasets
  - Incremental schema building
  - Smart sampling for large files

### **Phase 5: Advanced Features** (v2.0.0)

**High Impact, High Implementation**

- [ ] **Locale-Specific Detection**
  - Region-specific date formats (EU vs US)
  - Localized phone number validation
  - Currency format detection
  - Address format recognition

- [ ] **Security-Aware Detection**
  ```javascript
  '****-****-****-1234' -> 'credit_card_masked'
  '***-**-1234' -> 'ssn_masked'
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

- **Phase 1 (v1.2.0)**: ~2-3 weeks
- **Phase 2 (v1.3.0)**: ~3-4 weeks  
- **Phase 3 (v1.4.0)**: ~4-5 weeks
- **Phase 4 (v1.5.0)**: ~6-8 weeks
- **Phase 5 (v2.0.0)**: ~10-12 weeks

## 🤝 **Contributing**

We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- How to propose new features
- Development setup and testing
- Code style and quality standards
- Pull request process

## 💬 **Feedback & Discussion**

Have ideas or suggestions? We'd love to hear from you:
- 🐛 [Issue Tracker](https://github.com/melihbirim/predict-data-types/issues) - Bug reports and feature requests
- 💭 [Discussions](https://github.com/melihbirim/predict-data-types/discussions) - Ideas and questions
- 📧 Direct feedback via issues or pull requests

---

**Last Updated:** September 12, 2025  
**Next Review:** October 12, 2025
