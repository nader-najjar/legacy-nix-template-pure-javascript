/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  collectCoverageFrom: [
    'src/main/**/*.ts',
    '!src/main/Main.ts',
    '!src/main/LifecycleManager.ts',
    '!src/main/bootstrap/injection/**/*.ts'
  ],
  passWithNoTests: false,
  collectCoverage: true,
  coverageDirectory: 'build/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
