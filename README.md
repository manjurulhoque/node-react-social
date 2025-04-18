# Talksy - Social Media API

## Testing Setup

The project uses Jest for testing with a MongoDB in-memory database for testing purposes. This setup ensures that tests run in isolation and don't affect the actual database.

### Test Database Configuration

The test database is configured in `server/src/__tests__/config/setup.ts`. This file handles:

1. **Environment Setup**
   ```typescript
   // Set test environment variables
   process.env.JWT_SECRET = "test-secret-key";
   process.env.NODE_ENV = "test";
   ```
   - Sets necessary environment variables for testing
   - JWT_SECRET for token generation
   - NODE_ENV to indicate test environment

2. **Database Connection**
   ```typescript
   beforeAll(async () => {
       mongod = await MongoMemoryServer.create();
       const uri = mongod.getUri();
       await mongoose.connect(uri);
   });
   ```
   - Creates an in-memory MongoDB instance before all tests
   - Establishes connection to the test database
   - Runs before any test suite

3. **Database Cleanup**
   ```typescript
   afterEach(async () => {
       const collections = mongoose.connection.collections;
       for (const key in collections) {
           const collection = collections[key];
           await collection.deleteMany({});
       }
   });
   ```
   - Cleans up all collections after each test
   - Ensures test isolation
   - Prevents data leakage between tests

4. **Connection Teardown**
   ```typescript
   afterAll(async () => {
       await mongoose.connection.close();
       await mongod.stop();
   });
   ```
   - Closes database connection after all tests
   - Stops the in-memory MongoDB server
   - Runs after all test suites complete

### Jest Configuration

The project uses Jest with TypeScript support. Configuration is in `server/jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/config/setup.ts'],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
};
```

### Running Tests

Available test commands in `package.json`:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- Tests are located in `server/src/__tests__/`
- Test files follow the naming pattern `*.test.ts`
- Test configuration is in `server/src/__tests__/config/`
- Each test file focuses on a specific feature or route

### Benefits of This Setup

1. **Isolation**: Each test runs in isolation with a clean database
2. **Speed**: In-memory database is faster than a real MongoDB instance
3. **Reliability**: No interference with production or development databases
4. **Coverage**: Automatic code coverage reporting
5. **Type Safety**: Full TypeScript support in tests 