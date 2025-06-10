module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts" // Look for .test.ts files in the tests directory
  ],
  moduleNameMapper: {
    // This helps Jest resolve your module paths correctly,
    // especially for imports like '../src/server'
    // Adjust if your compiled output is in 'dist' or if paths are different
    '^@/(.*)$': '<rootDir>/src/$1', // Example: if you use @/ for src
    '^middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^routes/(.*)$': '<rootDir>/src/routes/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^src/(.*)$': '<rootDir>/src/$1', // Generic mapping for src
  },
  // Optionally, if you have a setup file for global mocks or configurations
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};