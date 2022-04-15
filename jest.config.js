module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/test/$1'
  }
}
